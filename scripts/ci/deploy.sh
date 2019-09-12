#!/usr/bin/env bash
if [ "$TRAVIS_BRANCH" == "master" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  export REACT_APP_ENVIRONMENT=prod
  export REACT_APP_APP_HOST=https://beta.october.news
  export REACT_APP_API_ENDPOINT=wss://engine.october.news/deck_endpoint/
  export REACT_APP_GRAPHQL_ENDPOINT=https://engine.october.news/graphql
  export REACT_APP_ALGOLIA_ENVIRONMENT=engine

  instances=( 54.201.138.198 54.202.240.163 )
  for i in "${instances[@]}"
  do
    HOST=$i ./scripts/ci/deploy_to_env.sh
  done
fi

if [ "$TRAVIS_BRANCH" == "development" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  export REACT_APP_ENVIRONMENT=dev
  export REACT_APP_APP_HOST=https://development.october.news
  export REACT_APP_API_ENDPOINT=wss://engine.development.october.news/deck_endpoint/
  export REACT_APP_GRAPHQL_ENDPOINT=https://engine.development.october.news/graphql
  export REACT_APP_ALGOLIA_ENVIRONMENT=development_engine

  instances=( 54.191.235.10 34.219.213.219 )
  for i in "${instances[@]}"
  do
    HOST=$i ./scripts/ci/deploy_to_env.sh
  done

  export REACT_APP_ENVIRONMENT=staging
  export REACT_APP_APP_HOST=https://staging.october.news
  export REACT_APP_API_ENDPOINT=wss://engine.staging.october.news/deck_endpoint/
  export REACT_APP_GRAPHQL_ENDPOINT=https://engine.staging.october.news/graphql
  export REACT_APP_ALGOLIA_ENVIRONMENT=staging_engine

  HOST=52.24.33.78 ./scripts/ci/deploy_to_env.sh
fi
