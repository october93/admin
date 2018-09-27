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
  SHADOWBAN_USER_REQUEST,
  SHADOWBAN_USER_SUCCESS,
  SHADOWBAN_USER_ERROR,
  REMOVE_USER_FROM_SHADOWBAN_REQUEST,
  REMOVE_USER_FROM_SHADOWBAN_SUCCESS,
  REMOVE_USER_FROM_SHADOWBAN_ERROR,
  GET_USER_INVITES_REQUEST,
  GET_USERS_INVITES_SUCCESS,
  GET_USERS_INVITES_ERROR,
  SET_USER_DEFAULT_STATUS_REQUEST,
  SET_USER_DEFAULT_STATUS_SUCCESS,
  SET_USER_DEFAULT_STATUS_ERROR,
} from "./types"


export const setUserDefaultStatusRequest = () => ({
  type: SET_USER_DEFAULT_STATUS_REQUEST,
})

export const setUserDefaultStatusSuccess = ({ id, status }) => ({
  type: SET_USER_DEFAULT_STATUS_SUCCESS,
  id,
  status,
})

export const setUserDefaultStatusError = error => ({
  type: SET_USER_DEFAULT_STATUS_ERROR,
  error,
})

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

export const shadowbanUserRequest = id => ({
  type: SHADOWBAN_USER_REQUEST,
  id,
})

export const shadowbanUserSuccess = id => ({
  type: SHADOWBAN_USER_SUCCESS,
  id,
})

export const shadowbanUserError = error => ({
  type: SHADOWBAN_USER_ERROR,
  error,
})


export const unshadowbanUserRequest = id => ({
  type: REMOVE_USER_FROM_SHADOWBAN_REQUEST,
  id,
})

export const unshadowbanUserSuccess = id => ({
  type: REMOVE_USER_FROM_SHADOWBAN_SUCCESS,
  id,
})

export const unshadowbanUserError = error => ({
  type: REMOVE_USER_FROM_SHADOWBAN_ERROR,
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
