#!/usr/bin/env bash

# stop execution if any command fails
# treat unset variables as an error
# print every command before executing it
set -euxo pipefail

REMOTE_USER=engine
HOST=${ENV:-latest}.october.news

# Install dependencies
yarn install

# Build for production
yarn build

curl -X POST -H 'Content-type: application/json' --data "{'text': 'Deploying admin panel to $HOST'}" https://hooks.slack.com/services/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

# Delete old files
ssh $REMOTE_USER@$HOST "rm -rf admin"

# Copy files to host
scp -r build $REMOTE_USER@$HOST:./admin
