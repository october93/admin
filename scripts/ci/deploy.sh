#!/usr/bin/env bash
if [ "$TRAVIS_BRANCH" == "master" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  ENV=latest ./scripts/ci/deploy_to_env.sh
  ENV=development ./scripts/ci/deploy_to_env.sh
  ENV=engine ./scripts/ci/deploy_to_env.sh
fi
