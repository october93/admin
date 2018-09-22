import {
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  GET_USERS_ERROR,
  UNBLOCK_USER_SUCCESS,
  BLOCK_USER_SUCCESS,
  CONNECTIONS_SUCCESS,
  SHADOWBAN_USER_SUCCESS,
  REMOVE_USER_FROM_SHADOWBAN_SUCCESS,
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
    case SHADOWBAN_USER_SUCCESS:{
      const newState = [...state]
      const idx = newState.findIndex(u => u.id === action.id)
      newState[idx] = {
        ...newState[idx],
        shadowbanned: true,
      }

      return newState
    }
    case REMOVE_USER_FROM_SHADOWBAN_SUCCESS:{
      const newState = [...state]
      const idx = newState.findIndex(u => u.id === action.id)
      newState[idx] = {
        ...newState[idx],
        shadowbanned: false,
      }
      return newState
    }
    case CONNECTIONS_SUCCESS: {
      const newState = [...state]
      const conns = action.connections.filter(connection => !connection.adminPanel)
      return newState.map(usr => {
        const matchingConnection = conns.find(c => {
          return c.session && c.session.user && c.session.user.username === usr.username})
        if (matchingConnection) {
          return {...usr, online: true}
        }
        return usr
      })
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
