import { connect, Connection, Channel } from "amqplib";
import { MessageBroker } from "./factory";

export interface RabbitConfiguration {
  type: "rabbitmq";
  hostname?: string;
  username: string;
  password: string;
  appName: string;
  serviceName: string;
}

export class RabbitMQ implements MessageBroker {
  private connection: Connection;
  private channel: Channel;

  private onClose() {
    console.debug("RabbitMQ channel closed.");
  }

  async connect(options: RabbitConfiguration) {
    try {
      this.connection = await connect({ protocol: "amqp", ...options });

      this.channel = await this.connection.createChannel();
      this.channel.on("close", this.onClose);

      this.config(options.appName, options.serviceName);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  async config(appName: string, serviceName: string) {
    await this.channel.assertExchange(appName, "fanout", {
      autoDelete: false,
      durable: true,
    });

    await this.channel.assertExchange(serviceName, "direct", {
      autoDelete: false,
      durable: true,
    });
  }
}
