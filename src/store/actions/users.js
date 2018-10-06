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
