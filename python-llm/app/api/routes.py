from fastapi import APIRouter, HTTPException

from app.api.schemas import ProcessRequest, ProcessResponse
from app.services.llm_service import LLMService

router = APIRouter()
llm_service = LLMService()


@router.post("/process", response_model=ProcessResponse)
async def process(body: ProcessRequest) -> ProcessResponse:
    try:
        result = llm_service.execute(body.type, {"text": body.text, "lang": body.lang})
        return ProcessResponse(summary=result["summary"])
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
