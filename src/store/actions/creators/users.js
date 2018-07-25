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
} from "./types"

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
