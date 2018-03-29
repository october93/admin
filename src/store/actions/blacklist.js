import GraphQLClient from '../GraphQLClient'
import gql from 'graphql-tag';

import * as create from "./creators/blacklist"

export const getBlacklist = () => async (dispatch) => {
  dispatch(create.getBlacklistRequest())
  try {
    const response = await GraphQLClient.Client().query({
      query: gql`
      {
        graph {
          blacklist
        }
      }
      `
    })
    dispatch(create.getBlacklistSuccess(response.data.graph.blacklist))
  } catch (e) {
    dispatch(create.getBlacklistError(e))
  }
}


export const setBlacklist = ids => async (dispatch) => {
  dispatch(create.setBlacklistRequest())
  try {
    await GraphQLClient.Client().mutate({
      mutation: gql`
      mutation {
        blacklistCards(ids:${ids})
      }
      `,
    })
    dispatch(create.setBlacklistSuccess())
  } catch (e) {
    dispatch(create.setBlacklistError(e))
  }
}


export const removeFromBlacklist = ids => async (dispatch) => {
  dispatch(create.removeBlacklistRequest())
  try {
    await GraphQLClient.Client().mutate({
      mutation: gql`
      mutation {
        removeFromBlacklist(ids:${ids})
      }
      `,
    })
    dispatch(create.removeBlacklistSuccess())
  } catch (e) {
    console.log(e)
    dispatch(create.removeBlacklistError(e))
  }
}
