#!/bin/bash

cd server/build/
./server &

cd ../../cache/
nodemon server.js &

cd ../frontend/
npm run start
