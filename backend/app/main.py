import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import AsyncOpenAI

load_dotenv()  # Load variables from backend/.env if present

HOPEAI_SYSTEM_PROMPT = (
    "you are an virtual ai assistant for hopeai. you response should be only related to drug usage and prevention, "
    "if any other question ask don't help"
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


class ChatIn(BaseModel):
    message: str


def get_client():
    key = os.getenv('OPENAI_API_KEY')
    if not key:
        raise HTTPException(status_code=503, detail='OPENAI_API_KEY is not set on the server')
    return AsyncOpenAI(api_key=key)


@app.post('/chat')
async def chat_endpoint(chat_in: ChatIn):
    client = get_client()
    res = await client.chat.completions.create(
        model=os.getenv('OPENAI_MODEL', 'gpt-4.1-mini'),
        temperature=0.3,
        messages=[
            { 'role': 'system', 'content': HOPEAI_SYSTEM_PROMPT },
            { 'role': 'user', 'content': chat_in.message }
        ]
    )
    reply = res.choices[0].message.content or ''
    return { 'reply': reply }


@app.head('/health')
@app.get('/health')
def health_check():
    has_key = bool(os.getenv('OPENAI_API_KEY'))
    return { 'status': 'ok', 'openai_key': 'configured' if has_key else 'missing' }
