from langchain.agents import create_agent
from app.ai.core.llm import get_llm
from app.ai.tool.tavily import tavily_search
from app.ai.middleware.tool_error import get_tool_error_middleware, get_tool_retry_middleware

search_tool = tavily_search()

chat_agent = create_agent(
    model=get_llm("groq"),
    tools=[search_tool],
    middleware=[
        get_tool_error_middleware(),
        get_tool_retry_middleware(
            max_retries=3,
            backoff_factor=2.0,
            initial_delay=1.0,
            max_delay=60.0,
            tools=[search_tool.name],
        ),
    ],
    system_prompt=(
        "You are Nexora's general assistant. "
        "Provide friendly, clear, and beginner-friendly answers."
    ),
)