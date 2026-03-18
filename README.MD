# Voice Learning Assistant

A voice-based learning app built with Next.js, FastAPI, MySQL and Groq LLM.

## Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL running locally with a `voice_chat` database

### Database
```sql
CREATE DATABASE voice_chat;
USE voice_chat;
CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy pymysql openai python-dotenv
cp .env.example .env            # then fill in your Groq key and DB password
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

### Usage
- Open http://localhost:3000 in Chrome
- Select a topic, press and hold the mic to speak
- The assistant responds in text and voice

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Next.js (Pages Router) |
| Backend | FastAPI + Uvicorn |
| Database | MySQL + SQLAlchemy |
| LLM | Groq API (llama-3.3-70b-versatile) |
| Voice | Web Speech API (STT + TTS) |