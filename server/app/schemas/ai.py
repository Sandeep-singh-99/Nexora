from typing import Optional
from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    thread_id: Optional[str] = "default_session"

class ChatResponse(BaseModel):
    response: str
    thread_id: Optional[str] = "default_session"