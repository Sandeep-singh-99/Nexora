from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver

from app.ai.core.state import AgentState
from app.ai.middleware.abuse_filter import guardrail_node
from app.ai.agents.router import router_node
from app.ai.agents.chat_agent import chat_node
from app.ai.agents.coding_agent import coding_node
from app.ai.agents.research_agent import research_node

def route_decision(state: AgentState) -> str:
    return state.get("next_step", "chat_agent")

builder = StateGraph(AgentState)

# Add Nodes
builder.add_node("guardrail", guardrail_node)
builder.add_node("router", router_node)
builder.add_node("chat_agent", chat_node)
builder.add_node("coding_agent", coding_node)
builder.add_node("research_agent", research_node)

# Flow Edges
builder.add_edge(START, "guardrail")
builder.add_edge("guardrail", "router")

builder.add_conditional_edges(
    "router",
    route_decision,
    {
        "chat_agent": "chat_agent",
        "coding_agent": "coding_agent",
        "research_agent": "research_agent",
    },
)

builder.add_edge("chat_agent", END)
builder.add_edge("coding_agent", END)
builder.add_edge("research_agent", END)

memory = MemorySaver()
ai_graph = builder.compile(checkpointer=memory)