import {
  GET_INVITES_REQUEST,
  GET_INVITES_SUCCESS,
  GET_INVITES_ERROR,
  NEW_INVITE_REQUEST,
  NEW_INVITE_SUCCESS,
  NEW_INVITE_ERROR,
  DEACTIVATE_INVITE_REQUEST,
  DEACTIVATE_INVITE_SUCCESS,
  DEACTIVATE_INVITES_ERROR,
} from "./types"



export const deactivateInviteRequest = () => ({
  type: DEACTIVATE_INVITE_REQUEST,
})

export const deactivateInviteSuccess = id => ({
  type: DEACTIVATE_INVITE_SUCCESS,
  id,
})

export const deactivateInviteError = error => ({
  type: DEACTIVATE_INVITES_ERROR,
  error,
})

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
