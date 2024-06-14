#!/bin/sh

cd code/guard
cp .env.example .env
sed -i "s/localhost:8000/$(hostname -I | gawk '{print $1}'):8000/g" .env
node --env-file=.env ./src/index.js
