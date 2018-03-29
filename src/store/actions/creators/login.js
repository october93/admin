import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT,
} from "./types"

export const loginRequest = () => ({
  type: LOGIN_REQUEST,
})

export const loginSuccess = () => ({
  type: LOGIN_SUCCESS,
})

export const loginError = error => ({
  type: LOGIN_ERROR,
  error,
})

export const logout = () => ({
  type: LOGOUT,
})
