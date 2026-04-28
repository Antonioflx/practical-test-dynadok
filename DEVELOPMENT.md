# Architecture & Development

## Overview

Two services communicate over HTTP:

- **node-api** — Node.js + TypeScript + Express (port `3005`)
- **python-llm** — Python + FastAPI + LangChain (port `8000`)

---

## Node API — DDD + Hexagonal Architecture

The Node API follows **Domain-Driven Design** with a **Hexagonal (Ports & Adapters)** structure, organized module-first:

```
src/
  modules/
    task/
      domain/
        entities/        Task entity
        value-objects/   TaskText (non-empty, trimmed)
        repositories/    ITaskRepository (port)
      application/
        use-cases/       CreateTask, GetAllTasks, GetTaskById, DeleteTask
        ports/           ILLMService (port)
        dtos/            CreateTaskDto
      infrastructure/
        repositories/    JsonTaskRepository (adapter — persists to data/tasks.json)
        llm/             PythonLLMClient (adapter — calls python-llm service)
        http/            TaskController, tasksRoutes
  shared/
    kernel/
      value-objects/     Id (UUID), Lang (pt | en | es)
    infrastructure/
      http/docs/         Swagger spec (swagger-jsdoc)
```

**Key design decisions:**

- **Entities** are built via `static create()` (factory) or `static restore()` (rehydration from persistence), never direct `new`.
- **Value Objects** are immutable and throw on invalid input — validation lives in the domain, not in controllers.
- **Ports** (`ITaskRepository`, `ILLMService`) are interfaces in the application layer. The infrastructure provides the adapters.
- **Shared Kernel** holds primitives reusable across future modules (`Id`, `Lang`).

---

## Python Service — Prompt Dispatch

The Python service uses a **prompt dispatch pattern** — each request type maps to a dedicated `BasePrompt` subclass:

```
app/
  api/
    routes.py            FastAPI routes
  services/
    llm_service.py       Dispatches by `type` field → runs the matching prompt
  prompts/
    task/
      prompt.py          TaskPrompt (calls LLM, returns { summary })
  shared/
    templates/
      langs.py           Language map + prompt templates (get_template)
```

Adding a new prompt type requires only: a new `BasePrompt` subclass + registration in `LLMService`. No changes elsewhere.

**LLM**: LangChain `ChatOpenAI` pointed at [HuggingFace Inference Router](https://huggingface.co/docs/inference-providers) (`featherless-ai/v1`), model `Qwen/Qwen2.5-7B-Instruct`.

---

## API Docs — Scalar

The Node API serves interactive documentation powered by **Scalar** at:

```
http://localhost:3005/docs
```

The OpenAPI spec (generated via `swagger-jsdoc` from JSDoc annotations in the route files) is exposed at:

```
http://localhost:3005/openapi.json
```

---

## Containerization — Docker

Both services are containerized with **multi-stage Dockerfiles** (builder + production) and run as non-root users.

Start everything from the project root:

```bash
cp .env.example .env
cp node-api/.env.example node-api/.env
cp python-llm/.env.example python-llm/.env
# fill in HF_TOKEN in python-llm/.env

docker compose up --build
```

| Service | URL |
|---------|-----|
| Node API + Scalar docs | `http://localhost:3005` |
| Python LLM | `http://localhost:8000` |

Task data is persisted in a named Docker volume (`node-data`). The `node-api` container waits for `python-llm` to be ready before starting (`depends_on`).