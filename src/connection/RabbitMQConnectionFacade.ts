import ConnectionFacade from './ConnectionFacade';
import { connect, Connection } from 'amqplib';
import Message from '../message/Message';
import MessageEmitter from '../messageBus/MessageBusEventEmitter';
import JSONMessage from '../message/JSONMessage';
import { error } from 'util';

export default class RabbitMQConnectionFacade implements ConnectionFacade {
    private connection: Connection;
    private readonly serviceName: string;
    private readonly appName: string;

    public constructor(serviceName: string, appName: string) {
        this.serviceName = serviceName;
        this.appName = appName;
    }

    public async connect(hostname: string, username: string, password: string): Promise<void> {
        //TODO colocar handlers de eventos para caso a conexao caia
        try {
            this.connection = await connect({
                protocol: 'amqp',
                hostname,
                port: 5672,
                username,
                password,
            });

            await this.setUp();
        } catch (e) {
            console.log(e);
        }

        //Verificar possivel realocação desse trecho de codigo para a classe de "Bus especifica"
        let channel = await this.connection.createChannel();
        const messagePull = new Map();

        channel.consume(`${this.serviceName}_message_queue`, msg => {
            const emitter = MessageEmitter.getMessageEmitter();

            if (msg.properties.appId === this.appName) {
                const descriptor = msg.fields.routingKey;

                messagePull.set(msg.properties.messageId, msg);

                emitter.on('error', messageId => {
                    channel.nack(msg);
                });

                emitter.on('success', messageId => {
                    channel.ack(msg);
                });

                const message = new JSONMessage(descriptor, msg.content, msg.properties.messageId);

                emitter.emit(descriptor, message);
            }
        });
    }

    public publish(message: Message): Promise<void> {
        return undefined;
    }

    public async subscribe(descriptor: string): Promise<void> {
        let channel = await this.connection.createChannel();
        await channel.bindQueue(`${this.serviceName}_message_queue`, `${this.serviceName}_exchange`, descriptor);
        await channel.close();
    }

    private async setUp(): Promise<void> {
        let channel = await this.connection.createChannel();

        /* Creating Exchanges and queues */
        await channel.assertExchange('mercury_main_message_bus', 'fanout', {
            durable: true,
            autoDelete: false,
        });
        await channel.assertExchange(`${this.serviceName}_exchange`, 'direct', {
            durable: true,
            autoDelete: false,
        });
        await channel.assertExchange(`${this.serviceName}_exchange_dead_letter`, 'fanout', {
            durable: true,
            autoDelete: false,
        });
        await channel.assertQueue(`${this.serviceName}_message_queue`, {
            durable: true,
            autoDelete: false,
            deadLetterExchange: `${this.serviceName}_exchange_dead_letter`,
        });
        await channel.assertQueue(`${this.serviceName}_message_queue_dead_letter`, {
            durable: true,
            autoDelete: false,
            deadLetterExchange: `${this.serviceName}_exchange`,
        });

        /* Creating the basic bindings */
        await channel.bindExchange('mercury_main_message_bus', `${this.serviceName}_exchange`, '');
        await channel.bindQueue(
            `${this.serviceName}_message_queue_dead_letter`,
            `${this.serviceName}_exchange_dead_letter`,
            '',
        );
        await channel.close();
    }

    public async subscribeAll(descriptors: string[]): Promise<void> {
        for (let descriptor of descriptors) {
            await this.subscribe(descriptor);
        }
    }
}
