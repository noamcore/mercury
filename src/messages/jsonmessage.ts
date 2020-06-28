import { Message } from "./message";

export class JsonMessage<T> extends Message<T> {
  getContent(): T {
    if (this.content instanceof Buffer) {
      return JSON.parse(this.content.toString());
    }

    return this.content;
  }

  getSerializedContent(): string {
    return JSON.stringify(this.content);
  }
}
