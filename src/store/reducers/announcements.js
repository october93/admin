import {
  CREATE_ANNOUNCEMENT_SUCCESS,
  GET_ANNOUNCEMENTS_SUCCESS,
} from '../actions/creators/types'

export function announcements(state = [], action) {
  switch (action.type) {
    case GET_ANNOUNCEMENTS_SUCCESS:
      return action.announcements
    case CREATE_ANNOUNCEMENT_SUCCESS:
      return [...state, action.announcement]
    default:
      return state
  }
}
