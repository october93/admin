import {
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  GET_USERS_ERROR,
  UNBLOCK_USER_REQUEST,
  UNBLOCK_USER_SUCCESS,
  UNBLOCK_USER_ERROR,
  BLOCK_USER_REQUEST,
  BLOCK_USER_SUCCESS,
  BLOCK_USER_ERROR,
  BLACKLIST_USER_REQUEST,
  BLACKLIST_USER_SUCCESS,
  BLACKLIST_USER_ERROR,
  REMOVE_USER_FROM_BLACKLIST_REQUEST,
  REMOVE_USER_FROM_BLACKLIST_SUCCESS,
  REMOVE_USER_FROM_BLACKLIST_ERROR,
  GET_USER_INVITES_REQUEST,
  GET_USERS_INVITES_SUCCESS,
  GET_USERS_INVITES_ERROR,
} from "./types"

export const getUserInvitesRequest = () => ({
  type: GET_USER_INVITES_REQUEST,
})

export const getUserInvitesSuccess = users => ({
  type: GET_USERS_INVITES_SUCCESS,
  users,
})

export const getUserInvitesError = error => ({
  type: GET_USERS_INVITES_ERROR,
  error,
})

export const blacklistUserRequest = id => ({
  type: BLACKLIST_USER_REQUEST,
  id,
})

export const blacklistUserSuccess = id => ({
  type: BLACKLIST_USER_SUCCESS,
  id,
})

export const blacklistUserError = error => ({
  type: BLACKLIST_USER_ERROR,
  error,
})


export const removeFromBlacklistRequest = id => ({
  type: REMOVE_USER_FROM_BLACKLIST_REQUEST,
  id,
})

export const removeFromBlacklistSuccess = id => ({
  type: REMOVE_USER_FROM_BLACKLIST_SUCCESS,
  id,
})

export const removeFromBlacklistError = error => ({
  type: REMOVE_USER_FROM_BLACKLIST_ERROR,
  error,
})

export const blockUserRequest = id => ({
  type: BLOCK_USER_REQUEST,
  id,
})

export const blockUserSuccess = id => ({
  type: BLOCK_USER_SUCCESS,
  id,
})

export const blockUserError = error => ({
  type: BLOCK_USER_ERROR,
  error,
})

export const unblockUserRequest = id => ({
  type: UNBLOCK_USER_REQUEST,
  id,
})

export const unblockUserSuccess = id => ({
  type: UNBLOCK_USER_SUCCESS,
  id,
})

export const unblockUserError = error => ({
  type: UNBLOCK_USER_ERROR,
  error,
})

export const getUsersRequest = () => ({
  type: GET_USERS_REQUEST,
})

export const getUsersSuccess = users => ({
  type: GET_USERS_SUCCESS,
  users,
})

export const getUsersError = error => ({
  type: GET_USERS_ERROR,
  error,
})
