import GraphQLClient from '../GraphQLClient'
import gql from 'graphql-tag';

export const getCardsWithStats = () => async (dispatch) => {
  dispatch(cardsCardsAreLoading(true))

  try {
    const response = await GraphQLClient.Client().query({
      errorPolicy: "ignore",
      query: gql`
        {
          cards {
            author {
              displayname
            }
            stats {
              boosts
              buries
              hifives
              views
            }
            card {
              body
              cardID
              post_timestamp
            }
          }
        }
      `
    })
    dispatch(cardsCardsLoadingSuccess(response.data))
    dispatch(cardsCardsAreLoading(false))
  } catch (e) {
    dispatch(cardsCardsLoadingFailure(e))
  }
}

export const CARDS_CARDS_ARE_LOADING = 'CARDS_CARDS_ARE_LOADING'

export function cardsCardsAreLoading(isLoading) {
  return {
    type: CARDS_CARDS_ARE_LOADING,
    isLoading: isLoading
  }
}


export const CARDS_CARDS_LOADING_SUCCESS = 'CARDS_CARDS_LOADING_SUCCESS'

export function cardsCardsLoadingSuccess(data) {
  return {
    type: CARDS_CARDS_LOADING_SUCCESS,
    data
  }
}

export const CARDS_CARDS_LOADING_FAILURE = 'CARDS_CARDS_LOADING_FAILURE'

export function cardsCardsLoadingFailure(error) {
  return {
    type: CARDS_CARDS_LOADING_FAILURE,
    error
  }
}

export const CARDS_SORT_BY = 'CARDS_SORT_BY'

export function cardsSortBy(sortBy) {
  return {
    type: CARDS_SORT_BY,
    sortBy
  }
}
