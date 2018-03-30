import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

import GraphQLClient from './GraphQLClient'
import APIClient from './SocketClient'

const defaultServerURL = `${location.hostname === "localhost" ? location.hostname + ":9000" : location.hostname}`

export default function configureStore(graphQLHost, initialState) {
  GraphQLClient.init(graphQLHost)

  // setup SockJS
  let wsProtocol = 'ws:'
  if (location.protocol === 'https:') {
    wsProtocol = 'wss:'
  }

  APIClient.init({
		webSocketHost: `${wsProtocol}//${defaultServerURL}/deck_endpoint/`,
	})

  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk)
  )
}
