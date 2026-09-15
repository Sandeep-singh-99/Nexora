from langchain_tavily import TavilySearch
from app.core.config import settings

def tavily_search() -> TavilySearch:
    return TavilySearch(
        max_search=3,
        topic="general",
        search_depth="advanced",
        tavily_api_search=settings.TAVILY_SEARCH,
    )