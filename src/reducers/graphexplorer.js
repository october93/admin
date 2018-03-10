import { 
  GRAPH_IS_LOADING,
  GRAPH_LOADING_SUCCESS,
  GRAPH_LOADING_FAILURE,
  LIMIT_TOP_EDGES,
  SELECT_USERNAME,
  LIMIT,
  HIGHLIGHT_EDGE,
  UNHIGHLIGHT_EDGE,
  SORT_EDGES,
  FILTER_USERS
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
      const usersByID = action.data.graph.users.reduce((map, user) => {
        map[user.nodeId] = user
        return map
      }, {})
      const edgesByUpWeight = action.data.graph.edges.map((k, v) => k).sort((a, b) => {
        return a.upWeight - b.upWeight
      })
      const edgesByDownWeight = action.data.graph.edges.map((k, v) => k).sort((a, b) => {
        return a.downWeight - b.downWeight
      })
      const followersByID = action.data.graph.edges.reduce((obj, edge) => {
        if (obj[edge.sourceID] === undefined) {
          obj[edge.sourceID] = []
        }
        obj[edge.sourceID].push(usersByID[edge.targetID].username)
        return obj
      }, {})
      return {
        usersByID,
        edgesByUpWeight,
        edgesByDownWeight,
        followersByID,
        graph: action.data.graph
      }
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

export function limitTopEdges(state = 10, action) {
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

export function sortEdges(state = {value: 'upWeight-asc'}, action) {
  switch (action.type) {
    case SORT_EDGES:
      const sortBy = action.sortBy.split('-')[0]
      const direction = action.sortBy.split('-')[1]
      return { sortBy, direction, value: action.sortBy }
    default:
      return state
  }
}

export function filteredUsers(state = '', action) {
  switch (action.type) {
    case FILTER_USERS:
      if (action.usernames === '') {
        return []
      } else {
        return action.usernames.split(',')
      }
    default:
      return state
  }
}
