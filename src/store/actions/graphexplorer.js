import GraphQLClient from '../GraphQLClient'
import gql from 'graphql-tag';

import * as create from "./creators/graphexplorer"

export const queryGraph = (usernames = ['nathaniel']) => async (dispatch) => {
  dispatch(graphIsLoading(true))

  try {
    const { data } = await GraphQLClient.Client().query({
      errorPolicy: "ignore",
      variables: { usernames },
      query: gql`
        query UsersByUsername($usernames: [String]) {
          users(usernames: $usernames) {
            id
            username
            displayName
            ...attentionRankFragment
            ...cardRankFragment
          }
        }
        fragment attentionRankFragment on User {
          node {
            following {
              upWeight
              downWeight
              source {
                user {
                  username
                }
              }
              target {
                user {
                  id
                  username
                  displayName
                }
              }
            }
            followers {
              upWeight
              downWeight
              source {
                user {
                  id
                  username
                  displayName
                }
              }
              target {
                user {
                  username
                }
              }
            }
          }
        }
        fragment cardRankFragment on User {
          feed {
            topScore
            boostScore
            buryScore
            scoreModifier
            commentScore
            timeOffset
            commentOffset
            seenCount
            card {
              id
              createdAt
              apparentAuthor {
                username
              }
              ...queryCardFragment
            }
            actions {
              reaction {
                reaction
                updatedAt
                user {
                  username
                }
              }
              score
            }
          }
        }
        fragment queryCardFragment on Card {
          content
          id
          createdAt
          apparentAuthor {
            displayName
            isAnonymous
            id
            profileImagePath
            username
          }
        }
      `
    })

    dispatch(graphLoadingSuccess(data))
    dispatch(graphIsLoading(false))
  } catch (e) {
    dispatch(graphLoadingFailure(e))
  }
}

/*export const queryCards = cardIDs => async (dispatch) => {
  dispatch(cardsAreLoading(true))

  try {
    const { data } = await GraphQLClient.Client().query({
      query: gql`
        {
          cards {
            content
            id
            createdAt
            apparentAuthor {
              displayName
              isAnonymous
              id
              profileImagePath
              username
            }
          }
        }
      `
    })

    dispatch(cardsLoadingSuccess(data))
    dispatch(cardsAreLoading(false))
  } catch (e) {
    dispatch(cardsLoadingFailure(e))
  }
}*/

export const queryGraphAndCards = (usernames) => async (dispatch, getState) => {
  try {
    await dispatch(queryGraph(usernames))
    /*const cardIDs = getState().graphLoadingSuccess.users.reduce((cards, user) => {
      user.feed.forEach(cardRank => {
        cards.push(cardRank.card.id)
      })
      return cards
    }, [])*/
    //await dispatch(queryCards(cardIDs))
  } catch (e) {
    console.log("graph query error")
    console.log(e)
  }
}

export const connectUsers = users => async (dispatch) => {
    dispatch(create.connectUsersRequest(users))
    try {
      await GraphQLClient.Client().mutate({
        mutation: gql`
        mutation {
          connectUsers(usernames:${JSON.stringify(users)} )
        }
        `,
      })

      dispatch(create.connectUsersSuccess())
    } catch (e) {
      console.log(e)
      dispatch(create.connectUsersError(e))
    }
}

export const CARDS_ARE_LOADING = 'CARDS_ARE_LOADING'

export function cardsAreLoading(isLoading) {
  return {
    type: CARDS_ARE_LOADING,
    isLoading: isLoading
  }
}

export const CARDS_LOADING_SUCCESS = 'CARDS_LOADING_SUCCESS'

export function cardsLoadingSuccess(data) {
  return {
    type: CARDS_LOADING_SUCCESS,
    data
  }
}

export const CARDS_LOADING_FAILURE = 'CARDS_LOADING_FAILURE'

export function cardsLoadingFailure(error) {
  return {
    type: CARDS_LOADING_FAILURE,
    error
  }
}

export const GRAPH_IS_LOADING = 'GRAPH_IS_LOADING'

export function graphIsLoading(isLoading) {
  return {
    type: GRAPH_IS_LOADING,
    isLoading: isLoading
  }
}

export const GRAPH_LOADING_SUCCESS = 'GRAPH_LOADING_SUCCESS'

export function graphLoadingSuccess(data) {
  return {
    type: GRAPH_LOADING_SUCCESS,
    data
  }
}

export const GRAPH_LOADING_FAILURE = 'GRAPH_LOADING_FAILURE'

export function graphLoadingFailure(error) {
  return {
    type: GRAPH_LOADING_FAILURE,
    error
  }
}

export const SELECT_USERNAME = 'SELECT_USERNAME'

export function selectUsername(username) {
  return {
    type: SELECT_USERNAME,
    username
  }
}

export const HIGHLIGHT_EDGE = 'HIGHLIGH_EDGE'

export function highlightEdge(sourceID, targetID) {
  return {
    type: HIGHLIGHT_EDGE,
    sourceID,
    targetID
  }
}

export const UNHIGHLIGHT_EDGE = 'UNHIGHLIGHT_EDGE'

export function unhighlightEdge(sourceID, targetID) {
  return {
    type: UNHIGHLIGHT_EDGE,
    sourceID,
    targetID
  }
}

export const SORT_EDGES = 'SORT_EDGES'

export function sortEdges(sortBy) {
  return {
    type: SORT_EDGES,
    sortBy
  }
}

export const FILTER_USERS = 'FILTER_USERS'

export function filterUsers(usernames) {
  return {
    type: FILTER_USERS,
    usernames: usernames
  }
}

export const SORT_VOTES = 'SORT_VOTES'

export function sortVotes(sortBy) {
  return {
    type: SORT_VOTES,
    sortBy
  }
}

export const SELECT_CARD_RANK_USER = 'SELECT_CARD_RANK_USER'

export function selectCardRankUser(username) {
  return {
    type: SELECT_CARD_RANK_USER,
    username
  }
}
