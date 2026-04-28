import type { Request, Response } from 'express'
import { CreateTask } from '../../application/use-cases/CreateTask'
import { DeleteTask } from '../../application/use-cases/DeleteTask'
import { GetAllTasks } from '../../application/use-cases/GetAllTasks'
import { GetTaskById } from '../../application/use-cases/GetTaskById'
import { PythonLLMClient } from '../llm/PythonLLMClient'
import { JsonTaskRepository } from '../repositories/JsonTaskRepository'

const repo = new JsonTaskRepository()
const llmService = new PythonLLMClient()

const createTask = new CreateTask(repo, llmService)
const getAllTasks = new GetAllTasks(repo)
const getTaskById = new GetTaskById(repo)
const deleteTask = new DeleteTask(repo)

export class TaskController {
	async create(req: Request, res: Response): Promise<void> {
		try {
			const task = await createTask.execute(req.body)
			res.status(201).json(task.toJSON())
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Internal server error'

			console.error('[TaskController] create error:', message)

			if (message === 'Language not supported') {
				res.status(400).json({ error: message })
				return
			}

			if (message === 'Text cannot be empty') {
				res.status(422).json({ error: message })
				return
			}

			res.status(500).json({ error: message })
		}
	}

	async getAll(_req: Request, res: Response): Promise<void> {
		const tasks = await getAllTasks.execute()
		res.json(tasks.map((t) => t.toJSON()))
	}

	async getById(req: Request, res: Response): Promise<void> {
		const task = await getTaskById.execute(req.params.id)

		if (!task) {
			res.status(404).json({ error: 'Task not found' })
			return
		}

		res.json(task.toJSON())
	}

	async remove(req: Request, res: Response): Promise<void> {
		await deleteTask.execute(req.params.id)
		res.json({ message: 'Successful Delete' })
	}
}
