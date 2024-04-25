#!/usr/bin/env bash

cd code/client
cp .config.ts.example .config.ts
sed -i "s/const MASTER_URL = '';/const MASTER_URL = 'http:\/\/$(hostname -I | gawk '{print $1}')';/g" .config.ts
sed -i "s/const API_URL = \`\${MASTER_URL}:port\/api\`;/const API_URL = \`\${MASTER_URL}:8000\/api\`;/g" .config.ts
npm start
