#!/bin/sh

cd code/client
ip=$(hostname -I | gawk '{print $1}')
cat <<EOF > .config.json
{
  "MASTER_URL": "http://$ip:8000"
}
EOF
npx expo start
