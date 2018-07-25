import {
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  GET_USERS_ERROR,
  UNBLOCK_USER_SUCCESS,
  BLOCK_USER_SUCCESS,
} from '../actions/creators/types'

export const users = (state = [], action) => {
  switch (action.type) {
    case GET_USERS_SUCCESS:{
      return action.users
    }
    case BLOCK_USER_SUCCESS:{
      const newState = [...state]
      const idx = newState.findIndex(u => u.id === action.id)
      newState[idx] = {
        ...newState[idx],
        blocked: true,
      }

      return newState
    }
    case UNBLOCK_USER_SUCCESS:{
      const newState = [...state]
      const idx = newState.findIndex(u => u.id === action.id)
      newState[idx] = {
        ...newState[idx],
        blocked: false,
      }

      return newState
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
