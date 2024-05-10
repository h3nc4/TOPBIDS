#!/usr/bin/env node
// Listens messages from broker and sends them to Master server

const amqp = require('amqplib/callback_api');

const API_URL = process.env.MASTER_URL + process.env.API_ROUTE

amqp.connect(process.env.MQ_CONNECTION_URL, function (error0, connection) {
    if (error0)
        throw error0;
    connection.createChannel(function (error1, channel) {
        if (error1)
            throw error1;
        channel.assertExchange(process.env.EXCHANGE_NAME, 'topic', { durable: false });
        channel.assertQueue('', { exclusive: true }, function (error2, q) {
            if (error2)
                throw error2;
            console.log('listening exchange messages for all topics');
            channel.bindQueue(q.queue, process.env.EXCHANGE_NAME, '#');
            channel.consume(q.queue, function (msg) {
                console.log('Received message from exchange', msg.content.toString());
                topic = msg.fields.routingKey.split('.');
                if (topic[1] === 'chat')
                    return;
                fetch(`${process.env.MASTER_URL}/auction/update/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', },
                    body: JSON.stringify({ ...JSON.parse(msg.content.toString()), item: topic[0] }),
                }).then(response => {
                    console.log('Sent message to Master', msg.fields.routingKey, msg.content.toString());
                    if (!response.ok)
                        console.log('Failed to ping Master server at', process.env.MASTER_URL);
                }).catch(error => {
                    console.error(error.message);
                });
            }, { noAck: true });
        });
    });
});
