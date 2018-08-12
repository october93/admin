import {
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  GET_USERS_ERROR,
  UNBLOCK_USER_SUCCESS,
  BLOCK_USER_SUCCESS,
  CONNECTIONS_SUCCESS,
  BLACKLIST_USER_SUCCESS,
  REMOVE_USER_FROM_BLACKLIST_SUCCESS,
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
    case BLACKLIST_USER_SUCCESS:{
      const newState = [...state]
      const idx = newState.findIndex(u => u.id === action.id)
      newState[idx] = {
        ...newState[idx],
        blacklisted: true,
      }

      return newState
    }
    case REMOVE_USER_FROM_BLACKLIST_SUCCESS:{
      const newState = [...state]
      const idx = newState.findIndex(u => u.id === action.id)
      newState[idx] = {
        ...newState[idx],
        blacklisted: false,
      }
      return newState
    }
    case CONNECTIONS_SUCCESS: {
      const newState = [...state]
      const conns = action.connections.filter(connection => !connection.adminPanel)
      return newState.map(usr => {
        const matchingConnection = conns.find(c => {
          console.log(c)
          return c.session && c.session.user && c.session.user.username === usr.username})
        console.log(matchingConnection)
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
