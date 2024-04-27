#!/usr/bin/env node

const mq = require('./mq/messaging');
const cfg = require('./.config.json');
const io = require('socket.io')(cfg.WS_PORT, {
    cors: {
        origin: '*',
    }
});

io.on('connection', (socket) => { // Handle incoming connections from clients
    console.log('WebSocket client connected');
    socket.on('joinRoom', (room) => { // Join room when requested by client
        mq.addClient(socket, room);
        socket.join(room);
        console.log(`Socket ${socket.id} joined room: ${room}`);
    });
    socket.on('message', async (data) => { // On message from client
        const { message, room } = data; // Assuming data includes both message and room name
        await mq.publish(message, room); // Update guards
    });
    socket.on('disconnect', () => { // Handle disconnections from WebSocket clients
        console.log('WebSocket client disconnected');
        mq.removeClient(socket); // Remove the client from the list
    });
});

mq.consume(); // Listen to messages from other guards
console.log('Guard service started');
