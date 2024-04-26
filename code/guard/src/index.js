#!/usr/bin/env node

const ws = require('./web/ws');

ws.startWS(); // Start WebSocket server and listen for incoming messages
console.log('Guard service started');
