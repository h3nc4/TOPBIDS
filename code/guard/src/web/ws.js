const mq = require('../mq/messaging');
const cfg = require('../.config');
const io = require('socket.io')(cfg.WS_PORT, {
    cors: {
        origin: '*',
    }
});

function initServer() {
    io.on('connection', (socket) => { // Handle incoming connections from clients
        console.log('WebSocket client connected');
        mq.addClient(socket); // Add the new client to the list
        socket.on('message', async (message) => { // On message from client
            await mq.publish(message); // Update guards
        });
    });
    io.on('disconnect', (socket) => { // Handle disconnections from WebSocket clients
        console.log('WebSocket client disconnected');
        mq.removeClient(socket); // Remove the client from the list
    });

    mq.consume(); // Listen to messages from other guards
}

module.exports = {
    initServer
};
