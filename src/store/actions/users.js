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
            id
            updatedAt
            node {
              cardRankTableSize
            }
            joinedFromInvite {
              issuer {
                username
              }
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


export const getPreviewFeed = username => async (dispatch) => {
    try {
      const response = await GraphQLClient.Client().query({
        errorPolicy: "ignore",
        query: gql`
        query {
          users(usernames:["${username}"]) {
            feed{
              cardID
            }
          }
        }
        `
      })

      const feedIDs = []
      if (response.data.users.length)
      response.data.users[0].feed.forEach(item => {
        feedIDs.push(item.cardID)
      })

      return feedIDs
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
