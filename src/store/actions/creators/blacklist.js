import {
  GET_BLACKLIST_REQUEST,
  GET_BLACKLIST_SUCCESS,
  GET_BLACKLIST_ERROR,
  SET_BLACKLIST_REQUEST,
  SET_BLACKLIST_SUCCESS,
  SET_BLACKLIST_ERROR,
} from "./types"

export const getBlacklistRequest = () => ({
  type: GET_BLACKLIST_REQUEST,
})

export const getBlacklistSuccess = blacklist => ({
  type: GET_BLACKLIST_SUCCESS,
  blacklist,
})

export const getBlacklistError = error => ({
  type: GET_BLACKLIST_ERROR,
  error,
})

export const setBlacklistRequest = () => ({
  type: SET_BLACKLIST_REQUEST,
})

export const setBlacklistSuccess = () => ({
  type: SET_BLACKLIST_SUCCESS,
})

export const setBlacklistError = error => ({
  type: SET_BLACKLIST_ERROR,
  error,
})
