export class TaskText {
  private constructor(private readonly value: string) {}

  static create(value: string): TaskText {
    if (!value || value.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }
    return new TaskText(value.trim());
  }

  toString(): string {
    return this.value;
  }
}
