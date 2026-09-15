from langchain_core.messages import AIMessage
from app.ai.core.state import AgentState
from app.ai.guardrails.input_filter import evaluate_input, AbuseFilterError
from app.ai.guardrails.output_filter import validate_output


async def input_guardrail_node(state: AgentState) -> dict:
    """LangGraph node to validate incoming human message against input guardrails.
    
    Sets state['is_blocked'] and state['block_reason'] without throwing runtime exceptions.
    """
    messages = state.get("messages", [])
    if not messages:
        return {"is_blocked": False}

    last_message = messages[-1]
    content = getattr(last_message, "content", "")
    if isinstance(content, str) and content.strip():
        result = evaluate_input(content)
        if not result.is_safe:
            return {
                "is_blocked": True,
                "block_reason": result.reason or "Your message violates safety policies.",
            }

    return {"is_blocked": False, "block_reason": None}


async def blocked_response_node(state: AgentState) -> dict:
    """LangGraph node executed when input guardrail flags a message.
    
    Appends a polite safety notice to the message history.
    """
    reason = state.get("block_reason") or "Your message was flagged by safety guardrails and could not be processed."
    refusal_message = AIMessage(
        content=f"🛡️ **Content Policy Notice**: {reason}"
    )
    return {"messages": [refusal_message]}


async def output_guardrail_node(state: AgentState) -> dict:
    """LangGraph node to validate agent output before returning to the user."""
    messages = state.get("messages", [])
    if not messages:
        return {}

    last_message = messages[-1]
    if isinstance(last_message, AIMessage):
        content = getattr(last_message, "content", "")
        if isinstance(content, str) and content.strip():
            result = validate_output(content)
            if not result.is_safe and result.sanitized_content:
                # Replace output with sanitized version
                sanitized_msg = AIMessage(content=result.sanitized_content)
                return {"messages": [sanitized_msg]}

    return {}


# Backwards compatibility alias
guardrail_node = input_guardrail_node