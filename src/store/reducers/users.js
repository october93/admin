import {
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  GET_USERS_ERROR,
} from '../actions/creators/types'

export const users = (state = [], action) => {
  switch (action.type) {
    case GET_USERS_SUCCESS:{
      return action.users
    }
    default:
      return state
  }
}

export const usersLoading = (state = true, action) => {
  switch (action.type) {
    case GET_USERS_REQUEST:
      return true
    case GET_USERS_SUCCESS:
    case GET_USERS_ERROR:
      return false
    default:
      return state
  }
}
