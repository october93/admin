import {
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  GET_USERS_ERROR,
} from "./types"

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
