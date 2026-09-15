from langchain_tavily import TavilySearch
from app.core.config import settings
from app.ai.middleware.tool_error import custom_tool_error_handler


def tavily_search() -> TavilySearch:
    """Configures Tavily web search tool with API keys and tool error handling."""
    tool = TavilySearch(
        max_results=3,
        topic="general",
        tavily_api_key=settings.TAVILY_SEARCH,
    )
    tool.handle_tool_error = custom_tool_error_handler
    return tool