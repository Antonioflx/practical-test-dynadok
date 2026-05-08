import type { NextFunction, Request, Response } from 'express'
import { HttpError } from '../../../../shared/errors/HttpError'
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
	async create(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const task = await createTask.execute(req.body)
			res.status(201).json(task.toJSON())
		} catch (err) {
			next(err)
		}
	}

	async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const tasks = await getAllTasks.execute()
			res.json(tasks.map((t) => t.toJSON()))
		} catch (err) {
			next(err)
		}
	}

	async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const task = await getTaskById.execute(req.params.id)

			if (!task) {
				next(new HttpError(404, 'Task not found'))
				return
			}

			res.json(task.toJSON())
		} catch (err) {
			next(err)
		}
	}

	async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			await deleteTask.execute(req.params.id)
			res.json({ message: 'Successful Delete' })
		} catch (err) {
			next(err)
		}
	}
}
