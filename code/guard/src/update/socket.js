import { addClient, removeClient, publish, currentBid } from '../mq/messaging.js'; // Import messaging functions

export function setupSockets(io) {
    io.on('connection', (socket) => {
        console.log('WebSocket client connected', socket.handshake.auth.jwt);
        fetch(`${process.env.MASTER_URL}/api/auth/check/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(socket.handshake.auth.jwt),
        }).then(response => {
            if (!response.ok)
                throw new Error('Invalid token');
            return response.json();
        }).then(data => {
            socket.id = data.user_id;
        }).catch(error => {
            console.error(error.message);
            console.log('Invalid token, disconnecting');
            socket.disconnect(true);
        });

        socket.on('join', (data) => {
            const { room, currentPrice } = data;
            addClient(socket, room);
            let roomInt = parseInt(room, 10);
            socket.join(roomInt);
            if (currentBid.id === roomInt) {
                console.log('Sending current bid to existing room', currentBid.amount);
                socket.emit('bid', currentBid.amount);
            } else {
                console.log('New room: ', roomInt)
                currentBid.amount = currentPrice;
                currentBid.id = roomInt;
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
}
