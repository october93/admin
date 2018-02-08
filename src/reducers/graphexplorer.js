import { 
  GRAPH_IS_LOADING,
  GRAPH_LOADING_SUCCESS,
  GRAPH_LOADING_FAILURE,
  LIMIT_TOP_EDGES,
  SELECT_USERNAME,
  LIMIT,
  HIGHLIGHT_EDGE,
  UNHIGHLIGHT_EDGE
} from '../actions/graphexplorer'

export function graphIsLoading(state = true, action) {
  switch (action.type) {
    case GRAPH_IS_LOADING:
      return action.isLoading
    default:
      return state
  }
}

export function graphLoadingSuccess(state = {}, action) {
  switch (action.type) {
    case GRAPH_LOADING_SUCCESS:
      return action.data
    default:
      return state
  }
}

export function graphLoadingFailure(state = null, action) {
  switch (action.type) {
    case GRAPH_LOADING_FAILURE:
      return action.error
    default:
      return state
  }
}

export function limitTopEdges(state = 5, action) {
  switch (action.type) {
    case LIMIT_TOP_EDGES:
      return action.limit
    default:
      return state
  }
}

export function selectedUsername(state = "", action) {
  switch (action.type) {
    case SELECT_USERNAME:
      return action.username
    default:
      return state
  }
}

export function limited(state = 5, action) {
  switch (action.type) {
    case LIMIT:
      return action.limit
    default:
      return state
  }
}

export function highlightedEdge(state = null, action) {
  switch (action.type) {
    case HIGHLIGHT_EDGE:
      return action.sourceID + "👉 " + action.targetID
    default:
      return state
  }
}

export function unhighlightedEdge(state = null, action) {
  switch (action.type) {
    case UNHIGHLIGHT_EDGE:
      return action.sourceID + "👉 " + action.targetID
    default:
      return state
  }
}
