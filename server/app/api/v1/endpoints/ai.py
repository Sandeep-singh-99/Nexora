from fastapi import APIRouter, HTTPException
import logging
from app.schemas.ai import ChatRequest, ChatResponse
from app.ai.agents.main_agent import create_main_agent
from app.ai.middleware.abuse_filter import AbuseFilterError

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="",
    tags=["AI"],
)


agent = create_main_agent()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        result = await agent.ainvoke({
            "messages": [
                {
                    "role": "user",
                    "content": request.message,
                }
            ]
        })

        response = result["messages"][-1].content

        return ChatResponse(
            response=str(response)
        )

    except AbuseFilterError as e:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "CONTENT_BLOCKED",
                "message": e.message,
            },
        )

    except Exception as e:
        logger.exception("AI request failed with error: %s", e)
        raise HTTPException(
            status_code=500,
            detail=f"AI request failed: {str(e)}",
        )