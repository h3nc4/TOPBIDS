import { getChannel } from './connect.js';

export const currentBid = {
    amount: 0,
    id: null,
};

const clients = new Map();

export function removeClient(clientWS) {
    clients.delete(clientWS.id);
}

export function addClient(clientWS, roomName) {
    clients.set(clientWS.id, { socket: clientWS, room: roomName });
}

export async function publish(message, room, user, type) { // Sends message to other guards in a specific room
    try {
        const topic = `${room}.${type}`; // Create topic based on room name and message type
        (await getChannel()).publish(process.env.EXCHANGE_NAME, topic, Buffer.from(JSON.stringify({ updated_value: message, user }))); // Publishes the message
    } catch (error) {
        console.error('Error sending message to RabbitMQ:', error);
    }
}

export async function consume() { // Listens to messages from other guards
    try {
        const queue = await (await getChannel()).assertQueue('', { exclusive: true });
        await (await getChannel()).bindQueue(queue.queue, process.env.EXCHANGE_NAME, '#'); // Listen to all topics
        console.log('Waiting for messages from MQ...');
        (await getChannel()).consume(queue.queue, (message) => {
            if (message.content) {
                const messageContent = JSON.parse(message.content.toString());
                const topicParts = message.fields.routingKey.split('.');
                const room = parseInt(topicParts[0]);
                const type = topicParts[1];
                if (type === 'bid') {
                    currentBid.id = room;
                    currentBid.amount = messageContent.updated_value;
                }
                clients.forEach((client, id) => { // There can only be one active room at a time
                    client.socket.emit(type, type === 'bid' ? messageContent.updated_value : messageContent);
                });
            }
        }, { noAck: true });
    } catch (error) {
        console.error('Error listening for messages from RabbitMQ:', error);
    }
}
