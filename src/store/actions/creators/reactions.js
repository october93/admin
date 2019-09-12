import {
  GET_REACTIONS_REQUEST,
  GET_REACTIONS_SUCCESS,
  GET_REACTIONS_ERROR,
} from "./types"

export const getReactionsRequest = () => ({
  type: GET_REACTIONS_REQUEST,
})

export const getReactionsSuccess = reactionUsers => ({
  type: GET_REACTIONS_SUCCESS,
  reactionUsers,
})

export const getReactionsError = error => ({
  type: GET_REACTIONS_ERROR,
  error,
})
