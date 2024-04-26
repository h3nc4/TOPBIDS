const mq = require('../mq/messaging');
const io = require('socket.io')(3000, {
    cors: {
        origin: '*',
    }
});

function startWS() {
    io.on('connection', (socket) => { // Handle incoming connections from WebSocket clients
        console.log('WebSocket client connected');
        socket.on('message', async (message) => { // On message event
            console.log('WS->Receive:', message);
            await mq.sendtoMQ(message); // Send message to MQ
        });
    });

    mq.listenAllMQ(); // Listen to all messages from MQ
}

module.exports = {
    startWS
};
