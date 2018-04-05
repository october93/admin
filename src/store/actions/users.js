import gql from 'graphql-tag'

import * as create from "./creators/users"
import GraphQLClient from '../GraphQLClient'

export const getUsers = () => async (dispatch) => {
    dispatch(create.getUsersRequest())
    try {
      const response = await GraphQLClient.Client().query({
        errorPolicy: "ignore",
        query: gql`
        {
          users {
            username
            nodeId
            updatedAt
            node {
              cardRankTableSize
            }
          }
        }
        `
      })
      dispatch(create.getUsersSuccess(response.data.users))
    } catch (e) {
      dispatch(create.getUsersError(e))
    }
}


export const getPreviewFeed = nodeID => async (dispatch) => {
    try {
      const response = await GraphQLClient.Client().query({
        errorPolicy: "ignore",
        query: gql`
        query {
          feedPreview(nodeID:"${nodeID}")
        }
        `
      })

      return response.data.feedPreview
    } catch (e) {
      console.log("Failed to get preview feed")
      console.log(e)
    }
}

export const getPreviewInviteFeed = nodeID => async (dispatch) => {
    try {
      const response = await GraphQLClient.Client().query({
        errorPolicy: "ignore",
        query: gql`
        query {
          inviteFeedPreview(inviterID:"${nodeID}")
        }
        `
      })
      console.log(response)

      return response.data.inviteFeedPreview
    } catch (e) {
      console.log("Failed to get preview feed")
      console.log(e)
    }
}
