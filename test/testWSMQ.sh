#!/usr/bin/env bash

# Open the first instance of the WebSocket client
xdg-open test/client/index.html
sleep 1

# Modify the WebSocket client to connect to port 3001
sed -i 's/3000/3001/g' test/client/index.html

# Open the second instance of the WebSocket client
xdg-open test/client/index.html
sleep 1

# Modify the WebSocket client to connect back to port 3000
sed -i 's/3001/3000/g' test/client/index.html

# Change directory to the guard service
cd code/guard

# Start the first instance of the WebSocket server and capture its PID
src/index.js &
pid1=$!
sleep 1

# Modify the configuration file to listen on port 3001
sed -i 's/3000/3001/g' src/.config.json

# Start the second instance of the WebSocket server and capture its PID
src/index.js &
pid2=$!
sleep 1

# Modify the configuration file to listen back on port 3000
sed -i 's/3001/3000/g' src/.config.json

# Print the PIDs of the started processes
echo "WebSocket server 1 on 3000: $pid1"
echo "WebSocket server 2 on 3001: $pid2"
