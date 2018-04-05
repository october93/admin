import {
  GET_REACTIONS_REQUEST,
  GET_REACTIONS_SUCCESS,
  GET_REACTIONS_ERROR,
} from '../actions/creators/types'

export const reactions = (state = [], action) => {
  switch (action.type) {
    case GET_REACTIONS_SUCCESS:
      return action.reactionUsers.reduce(
        (acc, usr) =>
          [
            ...acc,
            ...usr.reactions.map(r => ({
              ...r,
              updatedAt: r.updatedAt.unix,
              username: usr.username,
            }))
          ], [])
    default:
      return state
  }
}

export const reactionsLoading = (state = true, action) => {
  switch (action.type) {
    case GET_REACTIONS_REQUEST:
      return true
    case GET_REACTIONS_SUCCESS:
    case GET_REACTIONS_ERROR:
      return false
    default:
      return state
  }
}
