import { Container } from "inversify";
import { RabbitConfiguration } from "./rabbitmq";
import { Factory, MessageBroker } from "./factory";

export type BrokerConfiguration = RabbitConfiguration;
export type BrokerType = BrokerConfiguration["type"];

export class Mercury {
  private broker: MessageBroker;
  static bindings = new Map<string, string>();

  constructor(private container: Container) {}

  public run(options: BrokerConfiguration): void {
    this.broker = Factory.make(options.type);
    this.broker.connect(options);
  }
}
