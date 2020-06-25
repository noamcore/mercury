import { Message } from "./message";

export class JsonMessage extends Message<object> {
  get content(): object {
    if (this.options?.content instanceof Buffer) {
      return JSON.parse(this.options?.content.toString());
    }

    return this.options?.content;
  }

  get serializedContent(): string {
    return JSON.stringify(this.content);
  }
}
