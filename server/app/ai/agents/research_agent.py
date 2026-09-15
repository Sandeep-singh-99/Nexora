from langchain.agents import create_agent
from langchain_tavily import TavilySearch
from app.ai.core.llm import get_llm

search_tool = TavilySearch(max_results=5)

research_agent = create_agent(
    model=get_llm("groq"),
    tools=[search_tool],
    system_prompt=(
        "You are Nexora's research assistant. "
        "Provide factual, structured, and in-depth answers to user inquiries using web search tools."
    )
)
