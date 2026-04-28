import os

from langchain_openai import ChatOpenAI

from app.prompts.task.prompt import TaskPrompt


class LLMService:
    def __init__(self) -> None:
        llm = ChatOpenAI(
            model=os.getenv("HF_MODEL", "Qwen/Qwen2.5-7B-Instruct"),
            temperature=0.5,
            top_p=0.7,
            api_key=os.getenv("HF_TOKEN"),  # type: ignore
            base_url=os.getenv("HF_BASE_URL", "https://router.huggingface.co/featherless-ai/v1"),
        )
        self.prompts = {
            "task": TaskPrompt(llm),
        }

    def execute(self, type: str, payload: dict) -> dict:
        if type not in self.prompts:
            raise ValueError(f"Unknown type: {type}")

        return self.prompts[type].run(payload)
