from langchain_core.messages import HumanMessage

from app.prompts.base import BasePrompt
from app.shared.templates.langs import get_template


class TaskPrompt(BasePrompt):
    def run(self, payload: dict) -> dict:
        if "text" not in payload:
            raise ValueError("Missing text")

        if "lang" not in payload:
            raise ValueError("Missing lang")

        prompt = get_template("task", payload["lang"], payload["text"])
        response = self.llm.invoke([HumanMessage(content=prompt)])
        return {"summary": response.content}
