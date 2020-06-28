import { BrokerType, BrokerConfiguration } from "./mercury";
import { RabbitMQ } from "./rabbitmq";

export interface MessageBroker {
  connect(options: BrokerConfiguration): Promise<void>;
}

export class Factory {
  static make(type: BrokerType): MessageBroker {
    switch (type) {
      case "rabbitmq":
        return new RabbitMQ();
      default:
        throw new Error("Broker does not exists");
    }
  }
}
