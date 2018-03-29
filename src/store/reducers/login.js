import {
  LOGIN_ERROR,
} from '../actions/creators/types'

export const loginError = (state = "", action) => {
  switch (action.type) {
    case LOGIN_ERROR:{
      return action.error
    }
    default:
      return state
  }
}
