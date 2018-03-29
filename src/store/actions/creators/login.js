import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
} from "./types"

export const loginRequest = () => ({
  type: LOGIN_REQUEST,
})

export const loginSuccess = ({ user, session }) => ({
  type: LOGIN_SUCCESS,
  user,
  session,
})

export const loginError = error => ({
  type: LOGIN_ERROR,
  error,
})

export const logout = () => ({
  type: LOGOUT,
})


export const resetPasswordRequest = email => ({
  type: RESET_PASSWORD_REQUEST,
  email,
})

export const resetPasswordSuccess = () => ({
  type: RESET_PASSWORD_SUCCESS,
})

export const resetPasswordError = error => ({
  type: RESET_PASSWORD_ERROR,
  error,
})
