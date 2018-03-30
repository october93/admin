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
            token
            issuer
            expires
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
    await GraphQLClient.Client().mutate({
      mutation: gql`
        mutation {
          newInvite(nodeID:"${nodeID}")
        }
      `
    })

    dispatch(create.newInvitesSuccess())
  } catch (e) {
    dispatch(create.newInvitesError(e))
  }
}
