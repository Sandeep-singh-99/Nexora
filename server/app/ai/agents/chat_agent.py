from langchain.agents import create_agent
from app.ai.middleware.abuse_filter import AbuseFilterMiddleware
from app.ai.guardrails.abuse import abuse
from app.ai.core.llm import get_llm


def create_chat_agent():
    model = get_llm("gemini")

    return create_agent(
        model=model,
         system_prompt=(
            "You are a simple general-purpose chat assistant. "
            "Answer normal everyday questions clearly and simply. "
            "Keep explanations beginner-friendly. "
            
            "Do not answer coding, programming, software development, "
            "debugging, technical implementation, or developer questions. "
            
            "If the user's question is related to coding or technology, "
            "do not provide the technical answer. "
            "Instead, respond that the question should be handled by "
            "the coding assistant."
        ),
        middleware=[
            AbuseFilterMiddleware(
                banned_keywords=abuse
            )
        ],
    )
