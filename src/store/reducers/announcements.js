import {
  CREATE_ANNOUNCEMENT_SUCCESS,
  DELETE_ANNOUNCEMENT_REQUEST,
  GET_ANNOUNCEMENTS_SUCCESS,
} from '../actions/creators/types'

export function announcements(state = [], action) {
  switch (action.type) {
    case GET_ANNOUNCEMENTS_SUCCESS:
      return action.announcements
    case DELETE_ANNOUNCEMENT_REQUEST:
      return state.filter(a => a.id !== action.id)
    case CREATE_ANNOUNCEMENT_SUCCESS:
      return [...state, action.announcement]
    default:
      return state
  }
}
