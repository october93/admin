import {
  GET_CHANNELS_REQUEST,
  GET_CHANNELS_SUCCESS,
  GET_CHANNELS_ERROR,
  UPDATE_CHANNEL_REQUEST,
  UPDATE_CHANNEL_SUCCESS,
  UPDATE_CHANNEL_ERROR,
  NEW_CHANNEL_REQUEST,
  NEW_CHANNEL_SUCCESS,
  NEW_CHANNEL_ERROR,
  GET_CHANNEL_INVITE_REQUEST,
  GET_CHANNEL_INVITE_SUCCESS,
  GET_CHANNEL_INVITE_ERROR,
} from "./types"


export const getChannelInviteRequest = channelID => ({
  type: GET_CHANNEL_INVITE_REQUEST,
})

export const getChannelInviteSuccess = () => ({
  type: GET_CHANNEL_INVITE_SUCCESS,
})

export const getChannelInviteError = error => ({
  type: GET_CHANNEL_INVITE_ERROR,
  error,
})


export const getChannelsRequest = () => ({
  type: GET_CHANNELS_REQUEST,
})

export const getChannelsSuccess = ({ channels, channelEngagements }) => ({
  type: GET_CHANNELS_SUCCESS,
  channels,
  channelEngagements,
})

export const getChannelsError = error => ({
  type: GET_CHANNELS_ERROR,
  error,
})

export const updateChannelRequest = ({ id, name, isDefault, isPrivate }) => ({
  type: UPDATE_CHANNEL_REQUEST,
  id,
  name,
  isDefault,
  isPrivate,
})

export const updateChannelSuccess = () => ({
  type: UPDATE_CHANNEL_SUCCESS,
})

export const updateChannelError = error => ({
  type: UPDATE_CHANNEL_ERROR,
  error,
})


export const newChannelRequest = ({ name }) => ({
  type: NEW_CHANNEL_REQUEST,
  name,
})

export const newChannelSuccess = (channel) => ({
  type: NEW_CHANNEL_SUCCESS,
  channel,
})

export const newChannelError = error => ({
  type: NEW_CHANNEL_ERROR,
  error,
})
