import { combineReducers } from 'redux'
import {
  graphIsLoading,
  graphLoadingSuccess,
  graphLoadingFailure,
  limitTopEdges,
  selectedUsername,
  limitedVotes,
  highlightedEdge,
  unhighlightedEdge,
  sortEdges,
  filteredUsers,
  sortVotes
} from './graphexplorer'

export default combineReducers({
  graphIsLoading,
  graphLoadingSuccess,
  graphLoadingFailure,
  limitTopEdges,
  selectedUsername,
  limitedVotes,
  highlightedEdge,
  unhighlightedEdge,
  sortEdges,
  filteredUsers,
  sortVotes
})
