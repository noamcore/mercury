import { v4 as uuidv4 } from "uuid";

interface MessageDescription<ContentType> {
  uuid: string;
  descriptor: string;
  parentMessage: string;
  content: ContentType;
  creationDate: Date;
}

export abstract class Message<ContentType> {
  protected readonly options: MessageDescription<ContentType>;

  constructor(
    descriptor: string,
    content: ContentType,
    id?: string,
    timestamp?: number,
    parentMessage?: string
  ) {
    this.options = {
      content,
      creationDate: new Date(timestamp || ""),
      descriptor,
      parentMessage,
      uuid: id || uuidv4(),
    };
  }

  public abstract get content(): ContentType;
  public abstract get serializedContent(): string;

  public get uuid(): string {
    return this.options?.uuid;
  }

  public get descriptor(): string {
    return this.options?.descriptor;
  }

  public get parentMessage(): string {
    return this.options?.parentMessage;
  }

  public get creationDate(): Date {
    return this.options?.creationDate;
  }

  public setParentMessage(parentMessage: string): void {
    this.options.parentMessage = parentMessage;
  }
}
