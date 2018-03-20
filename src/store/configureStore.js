import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

import GraphQLClient from './GraphQLClient'


export default function configureStore(graphQLHost, initialState) {
  GraphQLClient.init(graphQLHost)

  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk)
  )
}
