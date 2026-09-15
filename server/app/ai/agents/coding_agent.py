from langchain.agents import create_agent
from app.ai.core.llm import get_llm

coding_agent = create_agent(
    model=get_llm("groq"),
    tools=[],
    system_prompt=(
        "You are Nexora's software engineering assistant. "
        "Help users write clean, modular, and performant code with detailed explanations."
    )
)
