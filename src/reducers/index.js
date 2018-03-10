import { combineReducers } from 'redux'
import {
  graphIsLoading,
  graphLoadingSuccess,
  graphLoadingFailure,
  limitTopEdges,
  selectedUsername,
  limited,
  highlightedEdge,
  unhighlightedEdge,
  sortEdges,
  filteredUsers
} from './graphexplorer'

export default combineReducers({
  graphIsLoading,
  graphLoadingSuccess,
  graphLoadingFailure,
  limitTopEdges,
  selectedUsername,
  limited,
  highlightedEdge,
  unhighlightedEdge,
  sortEdges,
  filteredUsers
})
