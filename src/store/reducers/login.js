import {
  LOGIN_SUCCESS,
  LOGIN_ERROR,
} from '../actions/creators/types'

export const loginError = (state = "", action) => {
  switch (action.type) {
    case LOGIN_ERROR: {
      return action.error
    }
    default:
      return state
  }
}

export const session = (state = null, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:{
      return action.session.id
    }
    default:
      return state
  }
}
