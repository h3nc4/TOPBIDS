// mq/messaging.js
const { getChannel } = require('./connect');
const cfg = require('../.config.json');

let clients = new Map(); // Use Map to store clients with room names

function removeClient(clientWS) { // Removes a client from the list
  clients.delete(clientWS.id); // Remove the client by socket ID
}

function addClient(clientWS, roomName) { // Adds a new client to the list with room name
  clients.set(clientWS.id, { socket: clientWS, room: roomName }); // Store client with socket ID and room name
}

async function publish(message, room) { // Sends message to other guards in a specific room
  try {
    const channel = await getChannel();
    const topic = `bid.${room}`; // Create topic based on room name
    channel.publish(cfg.EXCHANGE_NAME, topic, Buffer.from(message)); // Publish message to the topic
  } catch (error) {
    console.error('Error sending message to RabbitMQ:', error);
  }
}

async function consume() { // Listens to messages from other guards
  try {
    const channel = await getChannel();
    const queue = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(queue.queue, cfg.EXCHANGE_NAME, '#'); // Listen to all topics
    console.log('Waiting for messages from MQ...');
    channel.consume(queue.queue, (message) => {
      if (message.content) {
        const messageContent = message.content.toString();
        const topicParts = message.fields.routingKey.split('.'); // Parse topic to extract room name
        const room = topicParts[1]; // Extract room name from topic
        clients.forEach((client, id) => {
          if (client.room === room) // Send message only to clients in the specific room
            client.socket.emit('update', messageContent);
        });
      }
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
