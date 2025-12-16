from fastapi import FastAPI, Response
from pydantic import BaseModel
import requests
import os

app = FastAPI()

ELEVEN_API_KEY = os.environ.get("ELEVENLABS_API_KEY")
ELEVEN_VOICE_ID = os.environ.get("ELEVEN_VOICE_ID")

class SpeakRequest(BaseModel):
    text: str

@app.post("/speak")
def speak(req: SpeakRequest):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVEN_VOICE_ID}"

    headers = {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json"
    }

    payload = {
        "text": req.text,
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75
        }
    }

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code != 200:
        return {"error": "ElevenLabs TTS failed", "details": response.text}

    # Return audio bytes directly with correct Content-Type
    return Response(content=response.content, media_type="audio/mpeg")
