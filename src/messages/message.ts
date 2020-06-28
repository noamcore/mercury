import { v4 as uuidv4 } from "uuid";

export abstract class Message<ContentType = any> {
  private uuid: string;
  private descriptor: string;
  private parentMessage: string;
  protected content: ContentType;
  private creationDate: Date;

  constructor(
    descriptor: string,
    content: ContentType,
    id?: string,
    timestamp?: number,
    parentMessage?: string
  ) {
    this.content = content;
    this.descriptor = descriptor;
    this.creationDate = new Date(timestamp || null);
    this.parentMessage = parentMessage;
    this.uuid = id || uuidv4();
  }

  public abstract getContent(): ContentType;
  public abstract getSerializedContent(): string;

  public getUUID(): string {
    return this.uuid;
  }

  public getDescriptor(): string {
    return this.descriptor;
  }

  public getParentMessage(): string {
    return this.parentMessage;
  }

  public getCreationDate(): Date {
    return this.creationDate;
  }

  public setParentMessage(parentMessage: string): void {
    this.parentMessage = parentMessage;
  }

  public toString(): string {
    return JSON.stringify(this);
  }
}
