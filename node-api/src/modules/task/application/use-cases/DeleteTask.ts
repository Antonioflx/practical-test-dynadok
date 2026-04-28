import { ITaskRepository } from '../../domain/repositories/ITaskRepository';

export class DeleteTask {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
