import {
  WAITLIST_REQUEST,
  WAITLIST_SUCCESS,
  WAITLIST_FAILURE
} from '../actions/waitlist'

export function waitlistRequested(state = false, action) {
  switch (action.type) {
    case WAITLIST_REQUEST:
      return action.request
    default:
      return state
  }
}

export function waitlistSucceeded(state = {}, action) {
  switch (action.type) {
    case WAITLIST_SUCCESS:
      return action.data
    default:
      return state
  }
}

export function waitlistFailed(state = null, action) {
  switch (action.type) {
    case WAITLIST_FAILURE:
      return action.error
    default:
      return state
  }
}
