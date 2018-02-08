import GraphQLClient from '../store/GraphQLClient'
import gql from 'graphql-tag';

export function queryGraph(url) {
  return (dispatch) => {
    dispatch(graphIsLoading(true))
    const client = new GraphQLClient(url)
    client.client.query({
      errorPolicy: "ignore",
      query: gql`
        {
          graph {
            users {
              nodeId
              username
              displayname
              node {
                dpc {
                  cardID
                  positiveScore
                  negativeScore
                }
              }
            }
            edges {
              sourceID
              targetID
              upWeight
              downWeight
            }
          }
        }
      `
    })
    .then(response => response.data)
    .then(data => {
      dispatch(graphLoadingSuccess(data))
      dispatch(graphIsLoading(false))
    })
    .catch(error => dispatch(graphLoadingFailure(error)))
  }
}

export const GRAPH_IS_LOADING = 'GRAPH_IS_LOADING'

export function graphIsLoading(isLoading) {
  return {
    type: GRAPH_IS_LOADING,
    isLoading: isLoading,
  }
}

export const GRAPH_LOADING_SUCCESS = 'GRAPH_LOADING_SUCCESS'

export function graphLoadingSuccess(data) {
  return {
    type: GRAPH_LOADING_SUCCESS,
    data
  }
}

export const GRAPH_LOADING_FAILURE = 'GRAPH_LOADING_FAILURE'

export function graphLoadingFailure(error) {
  return {
    type: GRAPH_LOADING_FAILURE,
    error
  }
}

export const LIMIT_TOP_EDGES = 'LIMIT_TOP_EDGES'

export function limitTopEdges(limit) {
  return {
    type: LIMIT_TOP_EDGES,
    limit
  }
}

export const LIMIT = 'LIMIT'

export function limit(limit) {
  return {
    type: LIMIT,
    limit
  }
}

export const SELECT_USERNAME = 'SELECT_USERNAME'

export function selectUsername(username) {
  return {
    type: SELECT_USERNAME,
    username
  }
}

export const HIGHLIGHT_EDGE = 'HIGHLIGH_EDGE'

export function highlightEdge(sourceID, targetID) {
  return {
    type: HIGHLIGHT_EDGE,
    sourceID,
    targetID
  }
}

export const UNHIGHLIGHT_EDGE = 'UNHIGHLIGHT_EDGE'

export function unhighlightEdge(sourceID, targetID) {
  return {
    type: UNHIGHLIGHT_EDGE,
    sourceID,
    targetID
  }
}
