from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ChatRequest(BaseModel):
    message: str
    topic: Optional[str] = None

class ChatResponse(BaseModel):
    response: str

class MessageRecord(BaseModel):
    id: int
    message: str
    response: str
    created_at: datetime

    class Config:
        from_attributes = True