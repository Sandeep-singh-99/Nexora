from app.ai.core.llm import get_llm
from app.ai.core.state import AgentState

def coding_node(state: AgentState) -> dict:
    llm = get_llm("groq")
    system_prompt = (
        "You are Nexora's software engineering assistant. "
        "Help users write clean, modular, and performant code with detailed explanations."
    )
    messages = [{"role": "system", "content": system_prompt}] + list(state["messages"])
    response = llm.invoke(messages)
    return {"messages": [response]}
