import {
  CARDS_CARDS_ARE_LOADING,
  CARDS_CARDS_LOADING_SUCCESS,
  CARDS_CARDS_LOADING_FAILURE,
  CARDS_SORT_BY
} from '../actions/cards'

export function cardsCardsAreLoading(state = true, action) {
  switch (action.type) {
    case CARDS_CARDS_ARE_LOADING:
      return action.isLoading
    default:
      return state
  }
}

export function cardsCardsLoadingSuccess(state = {}, action) {
  switch (action.type) {
    case CARDS_CARDS_LOADING_SUCCESS:
      const data = action.data.cards.reduce((cards, card) => {
        cards[card.card.cardID] = card
        return cards
      }, {})
      return data
    default:
      return state
  }
}

export function cardsCardsLoadingFailure(state = null, action) {
  switch (action.type) {
    case CARDS_CARDS_LOADING_FAILURE:
      return action.error
    default:
      return state
  }
}

export function cardsSortedBy(state = 'boosts', action) {
  switch (action.type) {
    case CARDS_SORT_BY:
      return action.sortBy
    default:
      return state
  }
}
