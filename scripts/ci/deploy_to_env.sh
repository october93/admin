#!/usr/bin/env bash

# stop execution if any command fails
# treat unset variables as an error
# print every command before executing it
set -euxo pipefail

REMOTE_USER=engine

# Install dependencies
yarn install

# Build for production
yarn build

# Delete old files
ssh $REMOTE_USER@$HOST "rm -rf admin"

# Copy files to host
scp -r build $REMOTE_USER@$HOST:./admin
