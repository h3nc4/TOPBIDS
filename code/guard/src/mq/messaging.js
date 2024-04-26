const { getChannel } = require('./connect');
const cfg = require('../.config');

// Function to send message to RabbitMQ
async function sendtoMQ(message) {
  try {
    const channel = await getChannel();
    channel.publish(cfg.EXCHANGE_NAME, cfg.ROUTING_KEY, Buffer.from(message));
    console.log(`MQ->Sent: ${message}`);
  } catch (error) {
    console.error('Error sending message to RabbitMQ:', error);
  }
}

// Function to listen for messages from RabbitMQ
async function listenAllMQ() {
  try {
    const channel = await getChannel();
    const queue = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(queue.queue, cfg.EXCHANGE_NAME, cfg.ROUTING_KEY);
    console.log('Waiting for messages from MQ...');

    channel.consume(queue.queue, (message) => {
      if (message.content)
        console.log('MQ->Receive:', message.content.toString());
    }, { noAck: true });
  } catch (error) {
    console.error('Error listening for messages from RabbitMQ:', error);
  }
}

module.exports = {
  sendtoMQ,
  listenAllMQ
};
