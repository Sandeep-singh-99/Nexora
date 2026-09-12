from langchain.tools import tool

from app.ai.agents.chat_agent import create_chat_agent


@tool(
    "chat_agent",
    description=(
        "Use this tool for normal conversations with the user. "
        "It provides simple, clear and beginner-friendly answers."
    ),
)
def chat_agent(query: str) -> str:
    """Send a user query to the chat agent."""

    agent = create_chat_agent()

    result = agent.invoke({
        "messages": [
            {
                "role": "user",
                "content": query,
            }
        ]
    })

    return result["messages"][-1].content