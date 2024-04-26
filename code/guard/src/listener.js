#!/usr/bin/env node
// Small script that listens to all messages from the exchange

const amqp = require('amqplib/callback_api');
const cfg = require('./.config');

amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0)
        throw error0;
    connection.createChannel(function (error1, channel) {
        if (error1)
            throw error1;
        channel.assertExchange(cfg.EXCHANGE_NAME, 'topic', { durable: false });
        channel.assertQueue('', { exclusive: true }, function (error2, q) {
            if (error2)
                throw error2;
            console.log('listening exchange messages for all topics');
            channel.bindQueue(q.queue, cfg.EXCHANGE_NAME, '#');
            channel.consume(q.queue, function (msg) {
                console.log("%s:'%s'", msg.fields.routingKey, msg.content.toString());
            }, { noAck: true });
        });
    });
});
