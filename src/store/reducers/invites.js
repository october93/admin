import {
  GET_INVITES_SUCCESS,
} from '../actions/creators/types'

export const invites = (state = [], action) => {
  switch (action.type) {
    case GET_INVITES_SUCCESS:
      return action.invites
    default:
      return state
  }
}
