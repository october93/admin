#!/usr/bin/env bash
if [ "$TRAVIS_BRANCH" == "master" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  export REACT_APP_ENVIRONMENT=prod
  ENV=engine.internal ./scripts/ci/deploy_to_env.sh
fi

if [ "$TRAVIS_BRANCH" == "development" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  export REACT_APP_ENVIRONMENT=dev
  ENV=engine.internal.development ./scripts/ci/deploy_to_env.sh
fi
