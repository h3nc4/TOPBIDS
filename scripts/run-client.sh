#!/usr/bin/env bash

cd code/client
cp .config.json.example .config.json
sed -i "s/\"http:\/\/serverip\"/\"http:\/\/$(hostname -I | gawk '{print $1}')\"/g" .config.json
sed -i "s/\":serverport\/api\"/\":8000\/api\"/g" .config.json
npm start
