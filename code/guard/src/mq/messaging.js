const { getChannel } = require('./connect');
const cfg = require('../.config.json');

let clients = []; // All connected clients

function removeClient(clientWS) { // Removes a client from the list
    clients = clients.filter((client) => client !== clientWS);
}

function addClient(clientWS) { // Adds a new client to the list
    clients.push(clientWS);
}

async function publish(message) { // Sends message to other guards
  try {
    const channel = await getChannel();
    channel.publish(cfg.EXCHANGE_NAME, cfg.ROUTING_KEY, Buffer.from(message));
  } catch (error) {
    console.error('Error sending message to RabbitMQ:', error);
  }
}

async function consume() { // Listens to messages from other guards
  try {
    const channel = await getChannel();
    const queue = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(queue.queue, cfg.EXCHANGE_NAME, cfg.ROUTING_KEY);
    console.log('Waiting for messages from MQ...');
    channel.consume(queue.queue, (message) => {
      if (message.content)
        clients.forEach((client) => { // Sends the message to all clients connected to this guard
          client.emit('mqMessage', message.content.toString());
        });
    }, { noAck: true });
  } catch (error) {
    console.error('Error listening for messages from RabbitMQ:', error);
  }
}

module.exports = {
  addClient,
  removeClient,
  publish,
  consume
};
