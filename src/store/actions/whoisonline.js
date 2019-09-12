import GraphQLClient from '../GraphQLClient'
import gql from 'graphql-tag'

import {
  CONNECTIONS_REQUEST,
  CONNECTIONS_SUCCESS,
  CONNECTIONS_FAILURE,
} from './creators/types'

export const getConnections = () => async (dispatch) => {
  dispatch(connectionsRequest(true))
  try {
    const response = await GraphQLClient.Client().query({
      query: gql`
        {
          connections {
            createdAt
            ipAddress
            userAgent
            adminPanel
            session {
              id
              user {
                username
                displayName
              }
            }
          }
        }
      `
    })
    dispatch(connectionsSuccess(response.data.connections))
    dispatch(connectionsRequest(false))
  } catch (e) {
    dispatch(connectionsFailure(e))
    dispatch(connectionsRequest(false))
  }
}


export function connectionsRequest(request) {
  return {
    type: CONNECTIONS_REQUEST,
    request
  }
}

export function connectionsSuccess(connections) {
  return {
    type: CONNECTIONS_SUCCESS,
    connections,
  }
}


export function connectionsFailure(error) {
  return {
    type: CONNECTIONS_FAILURE,
    error
  }
}
