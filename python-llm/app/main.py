from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.responses import JSONResponse

from app.api.routes import router

app = FastAPI(title="LLM Summarizer", version="1.0.0")

app.include_router(router)


@app.get("/")
async def health() -> JSONResponse:
    return JSONResponse({"message": "API is running"})
