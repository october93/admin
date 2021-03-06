import GraphQLClient from '../GraphQLClient'
import gql from 'graphql-tag';

import * as create from "./creators/invites"

export const getInvites = () => async (dispatch) => {
  dispatch(create.getInvitesRequest(true))

  try {
    const { data } = await GraphQLClient.Client().query({
      errorPolicy: "ignore",
      query: gql`
        {
          invites {
            id
            token
            issuer {
              id
              username
            }
            hideFromUser
            groupID
            remainingUses
          }
        }
      `
    })
    dispatch(create.getInvitesSuccess(data.invites))
  } catch (e) {
    dispatch(create.getInvitesError(e))
  }
}

export const newInvite = nodeID => async (dispatch) => {
  dispatch(create.newInvitesRequest(nodeID))

  try {
    const response = await GraphQLClient.Client().mutate({
      mutation: gql`
        mutation {
          createInvite(userID:"${nodeID}") {
            token
          }
        }
      `
    })

    dispatch(create.newInvitesSuccess())
    return response.data.createInvite
  } catch (e) {
    dispatch(create.newInvitesError(e))
  }
}

export const deactivateInvite = id => async (dispatch) => {
  dispatch(create.deactivateInviteRequest(id))

  try {
    await GraphQLClient.Client().mutate({
      mutation: gql`
        mutation {
          deactivateInvite(id:"${id}")
        }
      `
    })

    dispatch(create.deactivateInviteSuccess(id))
  } catch (e) {
    dispatch(create.deactivateInviteError(e))
  }
}


export const bulkCreateInvites = ({ nodeID, count }) => async (dispatch) => {
  dispatch(create.newInvitesRequest(nodeID))

  const inviteArray = []

  for (let i = 0; i < count; i++) {
    try {
      const response = await GraphQLClient.Client().mutate({
        mutation: gql`
          mutation {
            createInvite(userID:"${nodeID}") {
              token
            }
          }
        `
      })

      dispatch(create.newInvitesSuccess())
      inviteArray.push(response.data.newInvite.token)
      console.log(response.data.newInvite.token)
    } catch (e) {
      console.log(e)
      dispatch(create.newInvitesError(e))
    }
  }

  return inviteArray

}
