#!/usr/bin/env bash

REMOTE_USER=engine
if [ "$STABLE" ]; then
  HOST=stable.october.news
else
  HOST=latest.october.news
fi

# Install current version of Node.js
source ~/.nvm/nvm.sh
nvm install 7.7.1

# Install dependencies
npm install

# Build for production
npm run build

curl -X POST -H 'Content-type: application/json' --data "{'text': 'Deploying admin panel to $HOST'}" https://hooks.slack.com/services/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

# Copy files to host
scp -r build $REMOTE_USER@$HOST:./admin
