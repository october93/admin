import {
  GET_INVITES_SUCCESS,
  DEACTIVATE_INVITE_SUCCESS,
} from '../actions/creators/types'

export const invites = (state = [], action) => {
  switch (action.type) {
    case GET_INVITES_SUCCESS:
      return action.invites
    case DEACTIVATE_INVITE_SUCCESS:
      return state.map(v => v.id === action.id ? {...v, remainingUses: 0} : v)
    default:
      return state
  }
}


export const invitesByGroupID = (state = {}, action) => {
  switch (action.type) {
    case GET_INVITES_SUCCESS:
      return action.invites.reduce((acc, inv) => {
        if (inv.groupID !== "") {
          const currentGroup = acc[inv.groupID] || []
          return {
            ...acc,
            [inv.groupID]: [...currentGroup, inv.token]
          }
        }
        return acc
      }, {})
    default:
      return state
  }
}
