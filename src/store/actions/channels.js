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
        }
      }
      `
    })
    dispatch(create.getChannelsSuccess(response.data))
  } catch (e) {
    dispatch(create.getChannelsError(e))
  }
}


export const updateChannel = ({ id, name }) => async (dispatch) => {
  dispatch(create.updateChannelRequest({ id, name }))
  try {
    await GraphQLClient.Client().mutate({
      mutation: gql`
      mutation {
        updateChannelName(id:"${id}", channelName:"${name}")
      }
      `,
    })
    dispatch(create.updateChannelSuccess())
  } catch (e) {
    dispatch(create.updateChannelError(e))
    return e
  }
}


export const createChannel = ({ name }) => async (dispatch) => {
  dispatch(create.newChannelRequest({ name }))
  try {
    const resp = await GraphQLClient.Client().mutate({
      mutation: gql`
      mutation {
        createChannel(channel:{name:"${name}"}) {
          id
          name
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
