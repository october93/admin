import {
  GET_INVITES_SUCCESS,
  DEACTIVATE_INVITE_SUCCESS,
  // GET_USERS_SUCCESS,
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


export const inviteesByInviter = (state = {}, action) => {
	return state
		/*
	 switch (action.type) {
    case GET_USERS_SUCCESS: {
      const newState = {}

      const rootUsers = action.users.filter(user => {
        try {
          console.log(user.joinedFromInvite)
          return !user.joinedFromInvite
        } catch (e) {
          console.log(e)
        }
      })
      console.log("rootUsers")
      console.log(rootUsers)
      action.users.forEach(user => {
        try {
          if (user.joinedFromInvite.issuer.id) {
            newState[user.id] = {
              ...newState[user.id],
              inviter: user.joinedFromInvite.issuer.id,
            }

            newState[user.joinedFromInvite.issuer.id] = {
              ...newState[user.joinedFromInvite.issuer.id],
              invited: [...(newState[user.joinedFromInvite.issuer.id] || {}).invited, user]
            }
          }
        } catch (e) {
          console.log(e)
        }
      })
      console.log("test 2")
      // const tree = {}



      return newState
    }
    default:
      return state
  }
	*/
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
