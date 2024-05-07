import amqp from 'amqplib'; // Import RabbitMQ library

let connection;
let channel;

export async function getChannel() { // Function to get a connection and channel to RabbitMQ
    if (!connection)
        connection = await amqp.connect(process.env.MQ_CONNECTION_URL);
    if (!channel) {
        channel = await connection.createChannel();
        await channel.assertExchange(process.env.EXCHANGE_NAME, 'topic', { durable: false });
    }
    return channel;
}
