#!/usr/bin/env node

import { consume } from './mq/messaging.js'; // Import consume function
import { setupSockets } from './update/socket.js'; // Import setupSockets function
import http from 'http'; // Import HTTP library
import { Server } from 'socket.io';

const API_URL = process.env.MASTER_URL + process.env.API_ROUTE;

function pingMaster() {
    fetch(`${API_URL}/guard/status/`).then(response => {
        if (!response.ok)
            console.log('Failed to ping Master server at', process.env.MASTER_URL);
        console.log('Master server acknowledged');
    }).catch(error => {
        console.log('Failed to ping Master server', process.env.MASTER_URL);
        console.error(error.message);
    });
}

// Create HTTP server for status endpoint and WebSocket
const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'GET' && req.url === '/status') {
        res.writeHead(200);
        res.end(); // Respond with 200 OK
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

// Setup WebSocket server on the same HTTP server
setupSockets(new Server(server, { cors: { origin: '*' } }));

consume(); // Start consuming messages from RabbitMQ

server.listen(3000, () => {
    console.log(`Server listening on port 3000`);
    pingMaster(); // Ping Master server to let it know this guard is online
    setInterval(pingMaster, process.env.INTERVAL || 60000); // Ping Master server every minute
});
