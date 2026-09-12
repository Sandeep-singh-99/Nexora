from langchain.agents import create_agent
from app.ai.tool.call_chat_agent import chat_agent
from app.ai.middleware.toolerror import tool_error_middleware

from app.ai.core.llm import get_llm


def create_main_agent():
    model = get_llm("gemini")

    return create_agent(
        model=model,
        tools=[chat_agent],
        system_prompt="""
You are the main AI assistant and router.

Your job is to understand the user's request
and select the appropriate specialized agent.

Available agents:

1. chat_agent
   - Normal conversation
   - General questions
   - Simple explanations

2. coding_agent
   - Programming
   - Debugging
   - Code generation
   - Software development

3. research_agent
   - Research
   - Web information
   - Detailed factual questions

Choose the most appropriate agent for the user's request.

Do not explain your routing decision to the user.
Return the final answer from the selected agent.
""",
        middleware=[
            tool_error_middleware,
        ],
    )
