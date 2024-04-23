#!/usr/bin/env bash

cd code/client
cp .config.ts.example .config.ts
# const MASTER_URL = 'http://192.168.0.151';
# const API_URL = `${MASTER_URL}:port/api`;
# export { API_URL };
# Change the MASTER_URL to the current IP address
sed -i "s/const MASTER_URL = '';/const MASTER_URL = 'http:\/\/$(hostname -I | awk '{print $1}')';/g" .config.ts
# Change the port number to 8000
sed -i "s/const API_URL = \`\${MASTER_URL}:port\/api\`;/const API_URL = \`\${MASTER_URL}:8000\/api\`;/g" .config.ts
npm start
