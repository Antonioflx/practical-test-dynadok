from abc import ABC, abstractmethod
from typing import Any


class BasePrompt(ABC):
    def __init__(self, llm: Any) -> None:
        self.llm = llm

    @abstractmethod
    def run(self, payload: dict) -> dict:
        pass
