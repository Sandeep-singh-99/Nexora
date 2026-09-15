from typing import Any
from app.ai.core.state import AgentState
from app.ai.guardrails.abuse import abuse

class AbuseFilterError(Exception):
    """Raised when user input violates the abuse guardrail."""

    def __init__(self, message: str = "Your message contains prohibited content."):
        self.message = message
        super().__init__(message)

async def guardrail_node(state: AgentState) -> dict:
    """LangGraph node to validate the latest message against prohibited content."""
    messages = state.get("messages", [])
    if not messages:
        return {}

    last_message = messages[-1]
    content = getattr(last_message, "content", "")
    if isinstance(content, str):
        text = content.lower()
        for keyword in abuse:
            if keyword.lower() in text:
                raise AbuseFilterError("Your message contains prohibited content.")

    return {}