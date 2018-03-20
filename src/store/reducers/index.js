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
  limitedCardRank,
} from './graphexplorer'

import {
  cardsCardsAreLoading,
  cardsCardsLoadingSuccess,
  cardsCardsLoadingFailure,
  cardsSortedBy
} from './cards'

import {
  homeFreezeSignupsSwitched,
  homeMaintenanceModeSwitched,
  homeGetSettingsSuccess
} from './home'

import {
  featureSwitchesLoading,
  featureSwitches,
} from './featureswitches'

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
  limitedCardRank,

  cardsCardsAreLoading,
  cardsCardsLoadingSuccess,
  cardsCardsLoadingFailure,
  cardsSortedBy,

  homeFreezeSignupsSwitched,
  homeMaintenanceModeSwitched,
  homeGetSettingsSuccess,

  featureSwitchesLoading,
  featureSwitches,
})
