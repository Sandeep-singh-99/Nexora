from app.ai.core.llm import get_llm
from app.ai.core.state import AgentState

def research_node(state: AgentState) -> dict:
    llm = get_llm("groq")
    system_prompt = (
        "You are Nexora's research assistant. "
        "Provide factual, structured, and in-depth answers to user inquiries."
    )
    messages = [{"role": "system", "content": system_prompt}] + list(state["messages"])
    response = llm.invoke(messages)
    return {"messages": [response]}
