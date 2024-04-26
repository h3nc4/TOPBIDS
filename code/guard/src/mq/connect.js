const amqp = require('amqplib');
const cfg = require('../.config');

let connection;
let channel;

async function getChannel() { // Function to get a connection and channel to RabbitMQ
    if (!connection)
        connection = await amqp.connect(cfg.MQ_CONNECTION_URL);
    if (!channel) {
        channel = await connection.createChannel();
        await channel.assertExchange(cfg.EXCHANGE_NAME, 'topic', { durable: false });
    }
    return channel;
}

module.exports = {
    getChannel
};
