from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from openai import OpenAI
from dotenv import load_dotenv
import os

from database import get_db, engine
from models import Base, Message
from schemas import ChatRequest, ChatResponse, MessageRecord

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Voice Learning Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

TOPIC_PROMPTS = {
    "Python": "You are an expert Python programming tutor. Explain Python concepts clearly with short code examples where helpful.",
    "Math":   "You are a patient math tutor. Break down problems step by step and explain the reasoning behind each step.",
    "AI":     "You are an AI and machine learning educator. Explain AI concepts intuitively, avoiding unnecessary jargon.",
    "General": "You are a helpful learning assistant. Explain concepts clearly and concisely.",
}

def get_system_prompt(topic: str | None) -> str:
    if topic and topic in TOPIC_PROMPTS:
        return TOPIC_PROMPTS[topic]
    return TOPIC_PROMPTS["General"]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": get_system_prompt(request.topic)
                },
                {
                    "role": "user",
                    "content": request.message
                }
            ]
        )
        response_text = completion.choices[0].message.content

        record = Message(message=request.message, response=response_text)
        db.add(record)
        db.commit()

        return ChatResponse(response=response_text)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/history", response_model=list[MessageRecord])
def get_history(db: Session = Depends(get_db)):
    return db.query(Message).order_by(Message.created_at.desc()).all()


@app.delete("/history")
def clear_history(db: Session = Depends(get_db)):
    db.query(Message).delete()
    db.commit()
    return {"message": "Chat history cleared"}