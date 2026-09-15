import json
import logging
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from langchain_core.messages import HumanMessage
from app.schemas.ai import ChatRequest, ChatResponse
from app.ai.graph import ai_graph
from app.ai.guardrails.input_filter import validate_input, AbuseFilterError

logger = logging.getLogger(__name__)
router = APIRouter(prefix="", tags=["AI"])


async def event_generator(message: str, thread_id: str):
    """Streams thinking steps, tool invocations (web search), guardrails status, and LLM response tokens."""
    config = {"configurable": {"thread_id": thread_id}}
    input_data = {"messages": [HumanMessage(content=message)]}

    try:
        # Stream events from LangGraph
        async for event in ai_graph.astream_events(input_data, config=config, version="v2"):
            kind = event.get("event")
            name = event.get("name", "")

            # 1. Node Execution Status Updates
            if kind == "on_chain_start" and name in [
                "input_guardrail",
                "router",
                "chat_agent",
                "coding_agent",
                "research_agent",
                "output_guardrail",
            ]:
                labels = {
                    "input_guardrail": "Evaluating safety policies...",
                    "router": "Analyzing request intent...",
                    "chat_agent": "Generating response...",
                    "coding_agent": "Architecting & writing code...",
                    "research_agent": "Conducting deep research...",
                    "output_guardrail": "Verifying response integrity...",
                }
                payload = json.dumps({"type": "status", "node": name, "label": labels.get(name, "Processing...")})
                yield f"data: {payload}\n\n"

            # 2. Web Search Tool Invocation
            elif kind == "on_tool_start" and "search" in name.lower():
                query = event.get("data", {}).get("input", {}).get("query", "")
                payload = json.dumps({"type": "search", "query": query, "status": "searching"})
                yield f"data: {payload}\n\n"

            elif kind == "on_tool_end" and "search" in name.lower():
                payload = json.dumps({"type": "search", "status": "completed"})
                yield f"data: {payload}\n\n"

            # 3. LLM Thinking & Reasoning Tokens or Blocked Message Content
            elif kind == "on_chat_model_stream":
                chunk = event["data"]["chunk"]
                
                additional_kwargs = getattr(chunk, "additional_kwargs", {})
                reasoning = additional_kwargs.get("reasoning_content") or getattr(chunk, "reasoning_content", None)

                if reasoning:
                    payload = json.dumps({"type": "thinking", "content": reasoning})
                    yield f"data: {payload}\n\n"

                elif chunk.content:
                    payload = json.dumps({"type": "token", "content": chunk.content})
                    yield f"data: {payload}\n\n"

            # 4. Stream blocked response node message content if graph routed to blocked_response
            elif kind == "on_chain_end" and name == "blocked_response":
                output = event.get("data", {}).get("output", {})
                msgs = output.get("messages", [])
                if msgs:
                    blocked_text = msgs[-1].content
                    payload = json.dumps({"type": "token", "content": blocked_text})
                    yield f"data: {payload}\n\n"

        # Signal completion
        yield f"data: {json.dumps({'type': 'end'})}\n\n"

    except Exception as e:
        logger.exception("Streaming error: %s", e)
        err_payload = json.dumps({"type": "error", "message": str(e)})
        yield f"data: {err_payload}\n\n"


@router.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """SSE Streaming Endpoint supporting Guardrails, Thinking, Web Search, and Tokens."""
    try:
        validate_input(request.message)
        thread_id = request.thread_id or "default_session"

        return StreamingResponse(
            event_generator(request.message, thread_id),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            },
        )
    except AbuseFilterError as e:
        raise HTTPException(
            status_code=400,
            detail={"code": e.code, "message": e.message},
        )
    except Exception as e:
        logger.exception("AI Stream execution error: %s", e)
        raise HTTPException(
            status_code=500,
            detail=f"AI request failed: {str(e)}",
        )


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Standard non-streaming JSON endpoint with pre-flight and graph guardrails."""
    try:
        validate_input(request.message)

        thread_id = request.thread_id or "default_session"
        config = {"configurable": {"thread_id": thread_id}}

        result = await ai_graph.ainvoke(
            {"messages": [HumanMessage(content=request.message)]},
            config=config,
        )

        final_response = result["messages"][-1].content

        return ChatResponse(
            response=str(final_response),
            thread_id=thread_id,
        )

    except AbuseFilterError as e:
        raise HTTPException(
            status_code=400,
            detail={"code": e.code, "message": e.message},
        )
    except Exception as e:
        logger.exception("AI Graph execution error: %s", e)
        raise HTTPException(
            status_code=500,
            detail=f"AI request failed: {str(e)}",
        )