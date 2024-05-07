#!/usr/bin/env bash

cd code/client
cp .config.json.example .config.json
sed -i "s/\"http:\/\/serverip:serverport\"/\"http:\/\/$(hostname -I | gawk '{print $1}'):8000\"/g" .config.json
sed -i "s/\"http:\/\/guardip:guardport\"/\"http:\/\/$(hostname -I | gawk '{print $1}'):3000\"/g" .config.json
npm start
