import gql from 'graphql-tag'

import * as create from "./creators/reactions"
import GraphQLClient from '../GraphQLClient'

export const getReactions = () => async (dispatch) => {
    dispatch(create.getReactionsRequest())
    try {
      const response = await GraphQLClient.Client().query({
        errorPolicy: "ignore",
        query: gql`
        {
          users {
            username
            reactions {
              cardID
              reaction
              sentToGraph
              strength
              updatedAt {
                unix
              }
            }
          }
        }
        `
      })
      dispatch(create.getReactionsSuccess(response.data.users))
    } catch (e) {
      dispatch(create.getReactionsError(e))
    }
}
