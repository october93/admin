import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

import GraphQLClient from './GraphQLClient'
import APIClient from './SocketClient'

const { REACT_APP_GRAPHQL_ENDPOINT} = process.env

export default function configureStore(graphQLHost, initialState) {
  GraphQLClient.init(REACT_APP_GRAPHQL_ENDPOINT)

  const session = localStorage.getItem("session")
  const loggedInUserID = localStorage.getItem("sessionuserid")

  APIClient.init({
		sessionID: session ? session.id : null,
	})

  return createStore(
    rootReducer,
    {
      ...initialState,
      loggedInUserID,
    },
    applyMiddleware(thunk)
  )
}
