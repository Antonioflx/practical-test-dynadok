import { Lang } from '../../../../shared/kernel/value-objects/Lang'
import { Task } from '../../domain/entities/Task'
import { ITaskRepository } from '../../domain/repositories/ITaskRepository'
import { TaskText } from '../../domain/value-objects/TaskText'
import { CreateTaskDto } from '../dtos/CreateTaskDto'
import { ILLMService } from '../ports/ILLMService'

export class CreateTask {
	constructor(
		private readonly taskRepository: ITaskRepository,
		private readonly llmService: ILLMService,
	) {}

	async execute(dto: CreateTaskDto): Promise<Task> {
		const text = TaskText.create(dto.text)
		const lang = Lang.create(dto.lang)

		const task = Task.create(text, lang)
		const summary = await this.llmService.summarize(dto.text, dto.lang)

		task.setSummary(summary)
		await this.taskRepository.save(task)

		return task
	}
}
