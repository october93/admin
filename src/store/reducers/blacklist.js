import {
  GET_BLACKLIST_SUCCESS,
} from '../actions/creators/types'

export function cardBlacklist(state = [], action) {
  switch (action.type) {
    case GET_BLACKLIST_SUCCESS:
      return action.blacklist
    default:
      return state
  }
}
