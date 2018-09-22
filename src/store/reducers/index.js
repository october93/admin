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
  //allCardRankEntries,
  //allVoteEntries,
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
  invitesByGroupID,
  inviteesByInviter,
} from './invites'

import {
  waitlistRequested,
  waitlistSucceeded,
  waitlistFailed,
  waitlist,
} from './waitlist'

import {
  connectionsRequested,
  connectionsSucceeded,
  connectionsFailed,
  connections,
} from './whoisonline'

import {
  reactions,
  reactionsLoading,
} from './reactions'

import {
  announcements,
} from './announcements'

import {
	engagements,
} from './engagements'

import {
	channels,
} from './channels'

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
  //allCardRankEntries,
  //allVoteEntries,

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

  users,
  usersLoading,
  sessions,
  commandResponses,

  loginError,

  invites,
  invitesByGroupID,
  inviteesByInviter,

  waitlistRequested,
  waitlistSucceeded,
  waitlistFailed,
  waitlist,

  connectionsRequested,
  connectionsSucceeded,
  connectionsFailed,
  connections,

  reactions,
  reactionsLoading,

  announcements,

	engagements,

  channels,
})
