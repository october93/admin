#!/usr/bin/env bash
if [ "$TRAVIS_BRANCH" == "master" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  export REACT_APP_ENVIRONMENT=prod
  export REACT_APP_APP_HOST=https://october.news
  export REACT_APP_API_ENDPOINT=wss://engine.october.news/deck_endpoint/
  export REACT_APP_GRAPHQL_ENDPOINT=https://engine.october.news/graphql
  export REACT_APP_ALGOLIA_ENVIRONMENT=engine
  ENV=engine.internal ./scripts/ci/deploy_to_env.sh
fi

if [ "$TRAVIS_BRANCH" == "development" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  export REACT_APP_ENVIRONMENT=dev
  export REACT_APP_APP_HOST=https://development.october.news
  export REACT_APP_API_ENDPOINT=wss://engine.development.october.news/deck_endpoint/
  export REACT_APP_GRAPHQL_ENDPOINT=https://engine.development.october.news/graphql
  export REACT_APP_ALGOLIA_ENVIRONMENT=development_engine

  ENV=engine.internal.development ./scripts/ci/deploy_to_env.sh
fi
