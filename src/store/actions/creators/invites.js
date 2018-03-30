import {
  GET_INVITES_REQUEST,
  GET_INVITES_SUCCESS,
  GET_INVITES_ERROR,
  NEW_INVITE_REQUEST,
  NEW_INVITE_SUCCESS,
  NEW_INVITE_ERROR,
} from "./types"


export const getInvitesRequest = () => ({
  type: GET_INVITES_REQUEST,
})

export const getInvitesSuccess = invites => ({
  type: GET_INVITES_SUCCESS,
  invites,
})

export const getInvitesError = error => ({
  type: GET_INVITES_ERROR,
  error,
})


export const newInvitesRequest = forNode => ({
  type: NEW_INVITE_REQUEST,
  forNode,
})

export const newInvitesSuccess = () => ({
  type: NEW_INVITE_SUCCESS,
})

export const newInvitesError = error => ({
  type: NEW_INVITE_ERROR,
  error,
})
