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
            lastActiveAt {
              time
            }
            displayName
            profileImagePath
            isDefault
            blocked
            shadowbanned
            coinBalance
            temporaryCoinBalance
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
            lastActiveAt {
              time
            }
            displayName
            profileImagePath
            blocked
            shadowbanned
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

export const updateCoinBalance = ({ userID, coins, tempCoins }) => async (dispatch) => {
  dispatch(create.updateCoinsRequest())

  try {
    await GraphQLClient.Client().mutate({
      mutation: gql`
        mutation {
          updateCoinBalances(userID: "${userID}", coinBalance: ${coins}, temporaryCoinBalance: ${tempCoins})
        }
      `
    })

    dispatch(create.updateCoinsSuccess({userID, coins, tempCoins}))
  } catch (e) {
    dispatch(create.updateCoinsError(e))
  }
}

export const setUserDefaultStatus = (id, status) => async (dispatch) => {
  dispatch(create.setUserDefaultStatusRequest())

  try {
    await GraphQLClient.Client().mutate({
      mutation: gql`
        mutation {
          setUserDefaultStatus(id:"${id}", status:${status})
        }
      `
    })

    dispatch(create.setUserDefaultStatusSuccess({id, status}))
  } catch (e) {
    dispatch(create.setUserDefaultStatusError(e))
  }
}

export const shadowbanUser = id => async (dispatch) => {
  dispatch(create.shadowbanUserRequest(id))

  try {
    await GraphQLClient.Client().mutate({
      mutation: gql`
        mutation {
          shadowbanUser(id:"${id}")
        }
      `
    })
    dispatch(create.shadowbanUserSuccess(id))
  } catch (e) {
    dispatch(create.shadowbanUserError(e))
  }
}

export const unshadowbanUser = id => async (dispatch) => {
  dispatch(create.unshadowbanUserRequest(id))
  try {
    await GraphQLClient.Client().mutate({
      mutation: gql`
        mutation {
          unshadowbanUser(id:"${id}")
        }
      `
    })

    dispatch(create.unshadowbanUserSuccess(id))
  } catch (e) {
    dispatch(create.unshadowbanUserError(e))
  }
}


export const previewUserFeed = id => async(dispatch) => {
  // dispatch(create.unshadowbanUserRequest(id))
  try {
    const resp = await GraphQLClient.Client().mutate({
      mutation: gql`
        mutation {
          previewUserFeed(userID:"${id}")
        }
      `
    })

    return resp.data.previewUserFeed
    //dispatch(create.unshadowbanUserSuccess(id))
  } catch (e) {
    console.log(e)
    return null
    //dispatch(create.unshadowbanUserError(e))
  }
}

export const getUserPool = id => async(dispatch) => {
  // dispatch(create.unshadowbanUserRequest(id))
  try {
    const resp = await GraphQLClient.Client().mutate({
      mutation: gql`
        mutation {
          getCardConfidenceData(userID:"${id}") {
            id
            upvoteCount
            downvoteCount
            commentCount
            viewCount
            goodness
            engagementScore
            confidence
            probabilitySurfaced
          }
        }
      `
    })

    return resp.data.getCardConfidenceData
    //dispatch(create.unshadowbanUserSuccess(id))
  } catch (e) {
    console.log(e)
    return null
    //dispatch(create.unshadowbanUserError(e))
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
