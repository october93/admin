import {
  CONNECT_USERS_REQUEST,
  CONNECT_USERS_SUCCESS,
  CONNECT_USERS_ERROR,
} from "./types"

export const connectUsersRequest = users => ({
  type: CONNECT_USERS_REQUEST,
  users,
})

export const connectUsersSuccess = () => ({
  type: CONNECT_USERS_SUCCESS,
})

export const connectUsersError = error => ({
  type: CONNECT_USERS_ERROR,
  error,
})
