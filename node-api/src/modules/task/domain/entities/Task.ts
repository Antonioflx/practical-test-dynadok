import { Id } from '../../../../shared/kernel/value-objects/Id';
import { Lang, LangValue } from '../../../../shared/kernel/value-objects/Lang';
import { TaskText } from '../value-objects/TaskText';

export interface TaskProps {
  id: string;
  text: string;
  lang: LangValue;
  summary: string | null;
}

export class Task {
  readonly id: string;
  readonly text: string;
  readonly lang: LangValue;
  summary: string | null;

  private constructor(props: TaskProps) {
    this.id = props.id;
    this.text = props.text;
    this.lang = props.lang;
    this.summary = props.summary;
  }

  static create(text: TaskText, lang: Lang): Task {
    return new Task({
      id: Id.create().toString(),
      text: text.toString(),
      lang: lang.toString(),
      summary: null,
    });
  }

  static restore(props: TaskProps): Task {
    return new Task(props);
  }

  setSummary(summary: string): void {
    this.summary = summary;
  }

  toJSON(): TaskProps {
    return {
      id: this.id,
      text: this.text,
      lang: this.lang,
      summary: this.summary,
    };
  }
}
