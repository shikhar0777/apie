# HopeAI Assistant (Simple)

A minimal full‑stack chatbot using FastAPI + OpenAI on the backend and React (Vite) on the frontend. The assistant follows this prompt:

"you are an virtual ai assistant for hopeai. you response should be only related to drug usage and prevention, if any other question ask don't help"

No databases, no streams, just a single POST `/chat` endpoint returning JSON.

## Structure
- `backend/`: Minimal FastAPI app with one endpoint.
- `frontend/`: React UI with optional voice input/output.

## Setup

Prereqs:
- Python 3.11+
- Node.js 18+
- Poetry

Backend:
- `cd backend && cp .env.example .env` and put your real `OPENAI_API_KEY`
- `poetry install`
- Run: `poetry run uvicorn app.main:app --reload --port 8000`

Frontend:
- `cd frontend && cp .env.example .env.development`
- Set `VITE_API_URL=http://localhost:8000`
- `npm install && npm run dev`
- Open `http://localhost:3000`

## Endpoint
- `POST /chat` with body `{ "message": "..." }` → `{ "reply": "..." }`

## Voice
- Voice input (mic) and voice output (speaker) use browser Web Speech APIs.
