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
            lastActiveAt
            displayName
            profileImagePath
            blocked
            blacklisted
            node {
              cardRankTableSize
            }
            joinedFromInvite {
              issuer {
                id
                username
              }
            }
          }
        }
        `
      })
      dispatch(create.getUsersSuccess(response.data.users))
      return response.data.users
    } catch (e) {
      dispatch(create.getUsersError(e))
    }
}

export const getUserInvites = () => async (dispatch) => {
    dispatch(create.getUserInvitesRequest())
    try {
      const response = await GraphQLClient.Client().query({
        errorPolicy: "ignore",
        query: gql`
        {
          users {
            username
            id
            updatedAt
            lastActiveAt
            displayName
            profileImagePath
            blocked
            blacklisted
            node {
              cardRankTableSize
            }
            joinedFromInvite {
              issuer {
                id
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

export const blockUser = id => async (dispatch) => {
  dispatch(create.blockUserRequest(id))

  try {
    await GraphQLClient.Client().mutate({
      mutation: gql`
        mutation {
          blockUser(id:"${id}")
        }
      `
    })

    dispatch(create.blockUserSuccess(id))
  } catch (e) {
    dispatch(create.blockUserError(e))
  }
}

export const blacklistUser = id => async (dispatch) => {
  dispatch(create.blacklistUserRequest(id))

  try {
    await GraphQLClient.Client().mutate({
      mutation: gql`
        mutation {
          blacklistUser(id:"${id}")
        }
      `
    })

    dispatch(create.blacklistUserSuccess(id))
  } catch (e) {
    dispatch(create.blacklistUserError(e))
  }
}

export const removeUserFromBlacklist = id => async (dispatch) => {
  dispatch(create.removeFromBlacklistRequest(id))
  try {
    await GraphQLClient.Client().mutate({
      mutation: gql`
        mutation {
          unblacklistUser(id:"${id}")
        }
      `
    })

    dispatch(create.removeFromBlacklistSuccess(id))
  } catch (e) {
    dispatch(create.removeFromBlacklistError(e))
  }
}


export const unblockUser = id => async (dispatch) => {
  dispatch(create.unblockUserRequest(id))

  try {
    await GraphQLClient.Client().mutate({
      mutation: gql`
        mutation {
          unblockUser(id:"${id}")
        }
      `
    })

    dispatch(create.unblockUserSuccess(id))
  } catch (e) {
    dispatch(create.unblockUserError(e))
  }
}

export const getPreviewFeed = username => async (dispatch) => {
    try {
      const response = await GraphQLClient.Client().query({
        errorPolicy: "ignore",
        query: gql`
        query {
          users(usernames:["${username}"]) {
            feed {
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

export const getPreviewInviteFeed = username => async (dispatch) => {
    try {
      const response = await GraphQLClient.Client().query({
        query: gql`
        query {
          users(usernames:["${username}"]) {
            inviteFeed {
              cardID
            }
          }
        }
        `
      })

      if (response.data.users[0].inviteFeed && response.data.users[0].inviteFeed.length > 0) {
        return response.data.users[0].inviteFeed.map(v => v.cardID)
      }

    } catch (e) {
      console.log("Failed to get invite preview feed")
      console.log(e)
    }
}
