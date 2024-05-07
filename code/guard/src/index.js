#!/usr/bin/env node

import { consume } from './mq/messaging.js'; // Import consume function
import { setupSockets } from './update/socket.js'; // Import setupSockets function

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

consume(); // Start consuming messages from RabbitMQ

setupSockets(); // Setup WebSocket server

pingMaster(); // Ping Master server to let it know this guard is online
setInterval(pingMaster, process.env.INTERVAL || 60000); // Ping Master server every minute