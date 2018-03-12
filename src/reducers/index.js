import { combineReducers } from 'redux'
import {
  graphIsLoading,
  graphLoadingSuccess,
  graphLoadingFailure,
  cardsAreLoading,
  cardsLoadingSuccess,
  cardsLoadingFailure,
  limitTopEdges,
  selectedUsername,
  limitedVotes,
  highlightedEdge,
  unhighlightedEdge,
  sortEdges,
  filteredUsers,
  sortVotes,
  selectedCardRankUser,
  limitedCardRank
} from './graphexplorer'

export default combineReducers({
  graphIsLoading,
  graphLoadingSuccess,
  graphLoadingFailure,
  cardsAreLoading,
  cardsLoadingSuccess,
  cardsLoadingFailure,
  limitTopEdges,
  selectedUsername,
  limitedVotes,
  highlightedEdge,
  unhighlightedEdge,
  sortEdges,
  filteredUsers,
  sortVotes,
  selectedCardRankUser,
  limitedCardRank
})
