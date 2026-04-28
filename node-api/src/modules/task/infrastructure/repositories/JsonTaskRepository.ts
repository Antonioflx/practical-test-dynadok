import fs from 'fs/promises';
import path from 'path';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { Task, TaskProps } from '../../domain/entities/Task';

export class JsonTaskRepository implements ITaskRepository {
  private readonly filePath = path.join(process.cwd(), 'data', 'tasks.json');

  private async read(): Promise<TaskProps[]> {
    try {
      const content = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(content) as TaskProps[];
    } catch {
      return [];
    }
  }

  private async write(tasks: TaskProps[]): Promise<void> {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(tasks, null, 2), 'utf-8');
  }

  async findAll(): Promise<Task[]> {
    const data = await this.read();
    return data.map(Task.restore);
  }

  async findById(id: string): Promise<Task | null> {
    const data = await this.read();
    const found = data.find(t => t.id === id);
    return found ? Task.restore(found) : null;
  }

  async save(task: Task): Promise<void> {
    const data = await this.read();
    const index = data.findIndex(t => t.id === task.id);
    if (index >= 0) {
      data[index] = task.toJSON();
    } else {
      data.push(task.toJSON());
    }
    await this.write(data);
  }

  async delete(id: string): Promise<void> {
    const data = await this.read();
    await this.write(data.filter(t => t.id !== id));
  }
}
