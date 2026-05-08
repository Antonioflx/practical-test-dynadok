import { HttpError } from '../../../../shared/errors/HttpError'

export class TaskText {
  private constructor(private readonly value: string) {}

  static create(value: string): TaskText {
    if (!value || value.trim().length === 0) {
      throw new HttpError(422, 'Text cannot be empty')
    }
    return new TaskText(value.trim());
  }

  toString(): string {
    return this.value;
  }
}
