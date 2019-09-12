import {
  GET_SESSIONS_REQUEST,
  GET_SESSIONS_SUCCESS,
  GET_SESSIONS_ERROR,
  SEND_COMMAND_REQUEST,
  SEND_COMMAND_SUCCESS,
  SEND_COMMAND_ERROR,
} from "./types"

export const getSessionsRequest = () => ({
  type: GET_SESSIONS_REQUEST,
})

export const getSessionsSuccess = sessions => ({
  type: GET_SESSIONS_SUCCESS,
  sessions,
})

export const getSessionsError = error => ({
  type: GET_SESSIONS_ERROR,
  error,
})

export const sendCommandRequest = command => ({
  type: SEND_COMMAND_REQUEST,
  command,
})

export const sendCommandSuccess = response => ({
  type: SEND_COMMAND_SUCCESS,
  response,
})

export const sendCommandError = error => ({
  type: SEND_COMMAND_ERROR,
  response: error,
})
