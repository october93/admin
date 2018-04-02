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

import {
  sessions,
  commandResponses,
} from './rpcconsole'

import {
  loginError,
} from './login'

import {
  invites,
} from './invites'

import {
  waitlistRequested,
  waitlistSucceeded,
  waitlistFailed,
  waitlist,
} from './waitlist'

import {
  reactions,
  reactionsLoading,
} from './reactions'

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
  sessions,
  commandResponses,

  loginError,

  invites,
  waitlistRequested,
  waitlistSucceeded,
  waitlistFailed,
  waitlist,

  reactions,
  reactionsLoading,
})
