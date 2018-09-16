import {
  CONNECTIONS_REQUEST,
  CONNECTIONS_SUCCESS,
  CONNECTIONS_FAILURE
} from '../actions/creators/types'

export function connectionsRequested(state = false, action) {
  switch (action.type) {
    case CONNECTIONS_REQUEST:
      return action.request
    default:
      return state
  }
}

export function connectionsSucceeded(state = {}, action) {
  switch (action.type) {
    case CONNECTIONS_SUCCESS:
      return true
    default:
      return state
  }
}

export const connections = (state = [], action) => {
  switch (action.type) {
    case CONNECTIONS_SUCCESS:
      return action.connections.filter(connection => !connection.adminPanel)
    default:
      return state
  }
}

export function connectionsFailed(state = null, action) {
  switch (action.type) {
    case CONNECTIONS_FAILURE:
      return action.error
    default:
      return state
  }
}
