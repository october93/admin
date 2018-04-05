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

  let session = localStorage.getItem("session")
  let endpoint = `${wsProtocol}//${defaultServerURL}/deck_endpoint/`

  if (session !== null) {
    session = JSON.parse(session)
    endpoint += `?session=${session.id}&adminpanel=true`
  }

  APIClient.init({
		webSocketHost: endpoint,
	})

  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk)
  )
}
