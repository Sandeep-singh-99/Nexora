from typing import Annotated, Sequence, Optional
from typing_extensions import TypedDict
from langchain_core.messages import BaseMessage, trim_messages
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    next_step: Optional[str]

def get_trimmed_messages(messages: Sequence[BaseMessage], max_tokens: int = 4000) -> list[BaseMessage]:
    """Trims message history to fit within context window limits safely."""
    return trim_messages(
        messages,
        max_tokens=max_tokens,
        strategy="last",
        token_counter=len,
        start_on="human",
        include_system=True,
    )