import GraphQLClient from '../GraphQLClient'
import APIClient from '../SocketClient'

import gql from 'graphql-tag';

import * as create from "./creators/rpcconsole"


export const getSessions = () => async (dispatch) => {
    dispatch(create.getSessionsRequest())
    try {
      const response = await GraphQLClient.Client().query({
        query: gql`
          {
            sessions {
              id
              user {
                username
              }
            }
          }
        `,
      })

      dispatch(create.getSessionsSuccess(response.data.sessions))
    } catch (e) {
      dispatch(create.getSessionsError(e))
    }
}

export const sendCommandRequest = command => async (dispatch) => {
  dispatch(create.sendCommandRequest(command))
  try {
    const response = await APIClient.getInstance().RPCRequest(JSON.parse(command))

    dispatch(create.sendCommandSuccess(response.data))
  } catch (e) {
    dispatch(create.sendCommandError(e))
  }
}
