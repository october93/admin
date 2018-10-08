import GraphQLClient from '../GraphQLClient'
import gql from 'graphql-tag';

import * as create from "./creators/channels"

export const getChannels = () => async (dispatch) => {
  dispatch(create.getChannelsRequest())
  try {
    const response = await GraphQLClient.Client().query({
      query: gql`
      {
        channels {
          id
          name
          isDefault
          isPrivate
        }
      }
      `
    })
    dispatch(create.getChannelsSuccess(response.data))
  } catch (e) {
    dispatch(create.getChannelsError(e))
  }
}


export const updateChannel = ({ id, name, isDefault, isPrivate }) => async (dispatch) => {
  dispatch(create.updateChannelRequest({ id, name, isDefault, isPrivate }))
  try {
    await GraphQLClient.Client().mutate({
      mutation: gql`
      mutation {
        updateChannel(id:"${id}", channel:{name:"${name}", isDefault:${isDefault}, isPrivate:${isPrivate}}) {
          id
          name
          isDefault
          isPrivate
        }
      }
      `,
    })
    dispatch(create.updateChannelSuccess())
  } catch (e) {
    dispatch(create.updateChannelError(e))
    return e
  }
}

export const getChannelInvite = ({ channelID, inviterID }) => async (dispatch) => {
  dispatch(create.getChannelInviteRequest(channelID))
  try {
    const resp = await GraphQLClient.Client().mutate({
      mutation: gql`
      mutation {
        createChannelInvite(channelID:"${channelID}", inviterID:${inviterID}) {
          token
        }
      }
      `,
    })
    dispatch(create.getChannelInviteSuccess())
    return resp.data.createChannelInvite.token
  } catch (e) {
    dispatch(create.getChannelInviteError(e))
    return e
  }
}


export const createChannel = ({ name, isDefault, isPrivate }) => async (dispatch) => {
  dispatch(create.newChannelRequest({ name, isDefault, isPrivate }))
  try {
    const resp = await GraphQLClient.Client().mutate({
      mutation: gql`
      mutation {
        createChannel(channel:{name:"${name}", isDefault:${isDefault}, isPrivate:${isPrivate}}) {
          id
          name
          isDefault
          isPrivate
        }
      }
      `,
    })
    dispatch(create.newChannelSuccess(resp.data.createChannel))
  } catch (e) {
    dispatch(create.newChannelError(e))
    return e
  }
}
