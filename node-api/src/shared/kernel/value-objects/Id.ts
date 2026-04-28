import { v4 as uuidv4 } from 'uuid';

export class Id {
  private constructor(private readonly value: string) {}

  static create(): Id {
    return new Id(uuidv4());
  }

  static from(value: string): Id {
    if (!value) throw new Error('Id cannot be empty');
    return new Id(value);
  }

  toString(): string {
    return this.value;
  }
}
