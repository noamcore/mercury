import { Message } from "./messages/message";

export interface Handler {
  handle: (message: Message) => Promise<void | Message | Message[]>;
}
