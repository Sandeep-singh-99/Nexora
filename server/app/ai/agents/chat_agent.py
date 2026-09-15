from langchain_core.messages import SystemMessage
from app.ai.core.llm import get_llm
from app.ai.core.state import AgentState, get_trimmed_messages

async def chat_node(state: AgentState) -> dict:
    llm = get_llm("groq")
    system_msg = SystemMessage(
        content=(
            "You are Nexora's general assistant. "
            "Provide friendly, clear, and beginner-friendly answers."
        )
    )
    history = get_trimmed_messages(state.get("messages", []))
    messages = [system_msg] + list(history)
    response = await llm.ainvoke(messages)
    return {"messages": [response]}