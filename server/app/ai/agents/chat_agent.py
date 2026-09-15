from langchain.agents import create_agent
from app.ai.core.llm import get_llm

chat_agent = create_agent(
    model=get_llm("groq"),
    tools=[],
    system_prompt=(
        "You are Nexora's general assistant. "
        "Provide friendly, clear, and beginner-friendly answers."
    )
)