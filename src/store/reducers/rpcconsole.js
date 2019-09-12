import {
  GET_SESSIONS_SUCCESS,
  SEND_COMMAND_SUCCESS,
  SEND_COMMAND_ERROR,
} from '../actions/creators/types'

export const sessions = (state = [], action) => {
  switch (action.type) {
    case GET_SESSIONS_SUCCESS:{
      return action.sessions
    }
    default:
      return state
  }
}

export const commandResponses  = (state = [], action) => {
  switch (action.type) {
    case SEND_COMMAND_SUCCESS:
    case SEND_COMMAND_ERROR: {
      return [
        ...state,
        {
          raw: action.response,
          string: JSON.stringify(action.response, null, 2),
        }
      ]
    }
    default:
      return state
  }
}
