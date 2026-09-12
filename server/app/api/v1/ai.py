from fastapi import APIRouter, HTTPException

from app.schemas.ai import ChatRequest, ChatResponse
from app.ai.agents.main_agent import create_main_agent
from app.ai.middleware.abuse_filter import AbuseFilterError


router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


agent = create_main_agent()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        result = agent.invoke({
            "messages": [
                {
                    "role": "user",
                    "content": request.message,
                }
            ]
        })

        response = result["messages"][-1].content

        return ChatResponse(
            response=response
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
        raise HTTPException(
            status_code=500,
            detail="AI request failed",
        )