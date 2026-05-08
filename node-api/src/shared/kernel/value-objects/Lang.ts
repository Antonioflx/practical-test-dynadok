import { HttpError } from '../../errors/HttpError'

const SUPPORTED = ['pt', 'en', 'es'] as const;
export type LangValue = typeof SUPPORTED[number];

export class Lang {
  private constructor(private readonly value: LangValue) {}

  static create(value: string): Lang {
    if (!SUPPORTED.includes(value as LangValue)) {
      throw new HttpError(400, 'Language not supported')
    }
    return new Lang(value as LangValue);
  }

  toString(): LangValue {
    return this.value;
  }
}
