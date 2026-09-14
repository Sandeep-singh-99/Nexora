from typing import Literal
from pydantic import BaseModel, Field
from app.ai.core.llm import get_llm
from app.ai.core.state import AgentState

class RouteDecision(BaseModel):
    next_step: Literal['chat_agent', 'coding_agent', 'research_agent'] = Field(
        description="The target agent node to handle the request."
    )

def router_node(state: AgentState) -> dict:
    try:
        llm = get_llm("groq").with_structured_output(RouteDecision, method="json_mode")
        system_prompt = (
            "Analyze the user request and choose the appropriate agent.\n"
            "Return your answer as a JSON object with key 'next_step' set to one of: chat_agent, coding_agent, research_agent.\n"
            "- chat_agent: General conversation, everyday greetings, simple Q&A.\n"
            "- coding_agent: Programming, debugging, software architecture, code generation.\n"
            "- research_agent: Deep research, web search, factual information."
        )
        messages = [{"role": "system", "content": system_prompt}] + list(state["messages"])
        decision = llm.invoke(messages)
        return {"next_step": decision.next_step}
    except Exception:
        return {"next_step": "chat_agent"}