import gql from 'graphql-tag'
import GraphQLClient from '../GraphQLClient'

export const shadowbanCard = cardID => async (dispatch) => {
    try {
      await GraphQLClient.Client().mutate({
        mutation: gql`
        mutation {
          shadowbanCards(ids:["${cardID}"])
        }
        `,
      })
    } catch (e) {
      return e
    }
}
