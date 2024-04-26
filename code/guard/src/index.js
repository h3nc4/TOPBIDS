#!/usr/bin/env node

const ws = require('./web/ws');

ws.initServer();
console.log('Guard service started');
