from typing import Literal

from pydantic import BaseModel


class ProcessRequest(BaseModel):
    text: str
    lang: Literal["pt", "en", "es"]
    type: str


class ProcessResponse(BaseModel):
    summary: str
