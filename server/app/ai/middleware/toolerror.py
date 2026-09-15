def handle_tool_error(exc: Exception, tool_name: str = "tool") -> str:
    """Standardized handler for tool execution errors."""
    if isinstance(exc, ValueError):
        return f"Tool `{tool_name}` failed with ValueError: {str(exc)}"
    return f"Tool `{tool_name}` encountered an unexpected error: {str(exc)}"