import { Server } from 'socket.io';
import http from 'http'; // Import HTTP library
import { addClient, removeClient, publish, currentBid } from '../mq/messaging.js'; // Import messaging functions

const server = http.createServer(); // Create HTTP server for WebSocket
const io = new Server(server, { cors: { origin: '*' } }); // Create WebSocket server

export function setupSockets() {
    io.on('connection', (socket) => {
        console.log('WebSocket client connected', socket.handshake.auth.jwt);
        fetch(`${process.env.MASTER_URL}/api/auth/check/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(socket.handshake.auth.jwt),
        }).then(response => {
            if (!response.ok)
                throw new Error('Invalid token');
            return response.json();
        }).then(data => {
            socket.id = data.user_id;
        }).catch(error => {
            console.error(error.message);
            socket.disconnect(true);
        });
        socket.on('join', (data) => {
            const { room, currentPrice } = data;
            addClient(socket, room);
            socket.join(room);
            if (currentBid.id === room) {
                socket.emit('bid', currentBid.amount);
            } else {
                currentBid.amount = currentPrice;
                currentBid.id = room;
                socket.emit('bid', currentBid.amount);
            }
        });

        socket.on('message', async (data) => {
            console.log('Received message:', data);
            const { message, room, user } = data;
            await publish(message, room, user, 'chat');
        });

        socket.on('bid', async (data) => {
            console.log('Received bid:', data);
            const { amount, room, user } = data;
            if (amount > currentBid.amount && amount !== Infinity && !isNaN(amount)) {
                await publish(amount, room, user, 'bid');
            } else {
                console.log('Invalid bid from', user);
            }
        });

        socket.on('disconnect', () => {
            console.log('WebSocket client disconnected');
            removeClient(socket);
        });
    });

    server.listen(process.env.WS_PORT || 3000, () => {
        console.log(`WebSocket server listening on port ${process.env.WS_PORT || 3000}`);
    });
}
