#!/usr/bin/env bash
if [ "$TRAVIS_BRANCH" == "master" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  ENV=engine.internal.development ./scripts/ci/deploy_to_env.sh
  ENV=engine.internal ./scripts/ci/deploy_to_env.sh
fi
