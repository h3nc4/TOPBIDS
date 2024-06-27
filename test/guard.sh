#!/usr/bin/env bash

# Number of instances to open
NUM_INSTANCES=500

# Loop to open WebSocket client instances
for ((i=1; i<=NUM_INSTANCES; i++)); do
    xdg-open test/client/index.html &
    sleep 1
done

# Change directory to the guard service
cd code/guard

# Start the instance of the WebSocket server and capture its PID
node --env-file=.env ./src/index.js &
pid1=$!
sleep 1

# Print the PID of the started WebSocket server process
echo "WebSocket server 1 on 3000: $pid1"
echo "To kill the WebSocket server:"
echo "kill $pid1"
