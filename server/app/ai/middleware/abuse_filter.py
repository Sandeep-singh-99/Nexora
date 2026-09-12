from typing import Any
from langchain.agents.middleware import AgentMiddleware


class AbuseFilterError(Exception):
    """Raised when user input violates the abuse guardrail."""

    def __init__(self, message: str = "Your message contains prohibited content."):
        self.message = message
        super().__init__(message)


class AbuseFilterMiddleware(AgentMiddleware):
    def __init__(self, banned_keywords: list[str]):
        self.banned_keywords = [
            keyword.lower() for keyword in banned_keywords
        ]

    def before_agent(
        self,
        state: dict[str, Any],
        runtime: Any,
    ):
        messages = state.get("messages", [])

        if not messages:
            return None

        last_message = messages[-1]
        content = getattr(last_message, "content", "")

        if not isinstance(content, str):
            return None

        text = content.lower()

        for keyword in self.banned_keywords:
            if keyword in text:
                raise AbuseFilterError(
                    "Your message contains prohibited content."
                )

        return None