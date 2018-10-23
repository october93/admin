#!/usr/bin/env bash
if [ "$TRAVIS_BRANCH" == "master" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  export REACT_APP_ENVIRONMENT=prod
  export REACT_APP_APP_HOST=https://october.news
  export REACT_APP_API_ENDPOINT=wss://engine.october.news/deck_endpoint/
  export REACT_APP_GRAPHQL_ENDPOINT=https://engine.october.news/graphql
  export REACT_APP_ALGOLIA_ENVIRONMENT=engine

  instances=( 54.201.138.198 54.202.240.163 )
  for i in "${instances[@]}"
  do
    HOST=$i ./scripts/ci/deploy_to_env.sh
  done

  # JIRA webhook to update fix version
  curl -X POST -H 'Content-type: application/json' https://automation.codebarrel.io/pro/hooks/94eb42c6037b088d3ff9c0cbd8f1229380670937

fi

if [ "$TRAVIS_BRANCH" == "development" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  export REACT_APP_ENVIRONMENT=dev
  export REACT_APP_APP_HOST=https://development.october.news
  export REACT_APP_API_ENDPOINT=wss://engine.development.october.news/deck_endpoint/
  export REACT_APP_GRAPHQL_ENDPOINT=https://engine.development.october.news/graphql
  export REACT_APP_ALGOLIA_ENVIRONMENT=development_engine

  instances=( 34.222.10.70 34.219.213.219 )
  for i in "${instances[@]}"
  do
    HOST=$i ./scripts/ci/deploy_to_env.sh
  done

  export REACT_APP_ENVIRONMENT=staging
  export REACT_APP_APP_HOST=https://staging.october.news
  export REACT_APP_API_ENDPOINT=wss://engine.staging.october.news/deck_endpoint/
  export REACT_APP_GRAPHQL_ENDPOINT=https://engine.staging.october.news/graphql
  export REACT_APP_ALGOLIA_ENVIRONMENT=staging_engine

  HOST=engine.internal.staging.october.news ./scripts/ci/deploy_to_env.sh
fi
