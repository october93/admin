import {
  GRAPH_IS_LOADING,
  GRAPH_LOADING_SUCCESS,
  GRAPH_LOADING_FAILURE,
  CARDS_ARE_LOADING,
  CARDS_LOADING_SUCCESS,
  CARDS_LOADING_FAILURE,
  SELECT_USERNAME,
  HIGHLIGHT_EDGE,
  UNHIGHLIGHT_EDGE,
  SORT_EDGES,
  FILTER_USERS,
  SORT_VOTES,
  SELECT_CARD_RANK_USER,
} from '../actions/graphexplorer'

export function graphIsLoading(state = true, action) {
  switch (action.type) {
    case GRAPH_IS_LOADING:
      return action.isLoading
    default:
      return state
  }
}

const attachUsersToCardRanks = (user, node) => {
  const { cardRankTable, votes } = node
  console.log(cardRankTable)
  console.log(votes)

  return cardRankTable.map((cr, index) => ({
      ...cr,
      userID: user.nodeId,
      username: user.username,
      scoreModifier: (votes.find(i => i.cardID === cr.card.cardID) || {}).scoreModifier || 0,
      index,
    })
  )
}

export const allCardRankEntries = (state = [], action) => {
  switch (action.type) {
    case GRAPH_LOADING_SUCCESS:
      return action.data.graph.users.reduce((acc, user) => {
        return [...acc, ...attachUsersToCardRanks(user, user.node)]
      }, [])
    default:
      return state
  }
}

const attachUsersToVotes = (user, votes) => {
  return votes.map((vote, index) => ({
      ...vote,
      userID: user.nodeId,
      username: user.username,
    })
  )
}

export const allVoteEntries = (state = [], action) => {
  switch (action.type) {
    case GRAPH_LOADING_SUCCESS:
      return action.data.graph.users.reduce((acc, user) => {
        return [...acc, ...attachUsersToVotes(user, user.node.votes)]
      }, [])
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

export function cardsAreLoading(state = true, action) {
  switch (action.type) {
    case CARDS_ARE_LOADING:
      return action.isLoading
    default:
      return state
  }
}

export function cardsLoadingFailure(state = null, action) {
  switch (action.type) {
    case CARDS_LOADING_FAILURE:
      return action.error
    default:
      return state
  }
}

export function cardsLoadingSuccess(state = {}, action) {
  switch (action.type) {
    case CARDS_LOADING_SUCCESS:
      const data = action.data.cards.reduce((cards, card) => {
        cards[card.card.cardID] = card
        return cards
      }, {})
      return data
    default:
      return state
  }
}

export function selectedUsername(state = null, action) {
  switch (action.type) {
    case SELECT_USERNAME:
      return action.username
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

export function sortEdges(state = {sortBy: 'upWeight', direction: 'asc'}, action) {
  switch (action.type) {
    case SORT_EDGES:
      return action.sortBy
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

export function sortVotes(state = {sortBy: 'positiveScore', direction: 'asc'}, action) {
  switch (action.type) {
    case SORT_VOTES:
      return action.sortBy
    default:
      return state
  }
}

export function selectedCardRankUser(state = null, action) {
  switch (action.type) {
    case SELECT_CARD_RANK_USER:
      return action.username
    default:
      return state
  }
}
