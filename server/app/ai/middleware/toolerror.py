from langchain.agents.middleware import ToolErrorMiddleware, ToolCallRequest

def handle_tool_error(exc: Exception, request: ToolCallRequest) -> str | None:
    if isinstance(exc, ValueError):
        return (
            f"Tool `{request.tool_call['name']}`"
            f"Failed: {type(exc).__name__}"
        )

    return None

tool_error_middleware = ToolErrorMiddleware(
    handle_tool_error
)