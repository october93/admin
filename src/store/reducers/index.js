import { combineReducers } from 'redux'
import {
  graphIsLoading,
  graphLoadingSuccess,
  graphLoadingFailure,
  cardsAreLoading,
  cardsLoadingSuccess,
  cardsLoadingFailure,
  selectedUsername,
  highlightedEdge,
  unhighlightedEdge,
  sortEdges,
  filteredUsers,
  sortVotes,
  selectedCardRankUser,
  allCardRankEntries,
  allVoteEntries,
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

import {
  tagsLoading,
  getTagsSuccessful,
  getTagsFailed,
  createTagSuccessful,
  createTagFailed,
} from './tags'

import {
  cardBlacklist,
} from './blacklist'

import {
  users,
  usersLoading,
} from './users'

export default combineReducers({
  graphIsLoading,
  graphLoadingSuccess,
  graphLoadingFailure,
  cardsAreLoading,
  cardsLoadingSuccess,
  cardsLoadingFailure,
  selectedUsername,
  highlightedEdge,
  unhighlightedEdge,
  sortEdges,
  filteredUsers,
  sortVotes,
  selectedCardRankUser,
  allCardRankEntries,
  allVoteEntries,
  
  cardsCardsAreLoading,
  cardsCardsLoadingSuccess,
  cardsCardsLoadingFailure,
  cardsSortedBy,

  homeFreezeSignupsSwitched,
  homeMaintenanceModeSwitched,
  homeGetSettingsSuccess,

  featureSwitchesLoading,
  featureSwitches,

  tagsLoading,
  getTagsSuccessful,
  getTagsFailed,
  createTagSuccessful,
  createTagFailed,

  cardBlacklist,

  users,
  usersLoading,
})
