import React from 'react'
import { Router, Route, Redirect } from 'react-router'

import { Provider } from "mobx-react"

import AdminLayout from './components/AdminLayout'
import LoginPage from './components/LoginPage'
import GraphQLPage from './components/GraphQLPage'
import ResetPasswordPage from "./components/ResetPasswordPage"
import InvitesPage from "./components/InvitesPage"
import AdminStore from "./store/AdminStore"

import Home from './scenes/Home'
import Cards from './scenes/Cards'
import Tags from './scenes/Tags'
import GraphExplorer from './scenes/GraphExplorer'
import FeatureSwitches from './scenes/FeatureSwitches'
import Moderation from './scenes/Moderation'
import UsersPage from './scenes/Users'
import UtilitiesPage from './scenes/RPCConsole'
import NotFoundPage from './scenes/NotFound'


const requireAuth = (nextState, replace) => {
  if (!AdminStore.loggedIn()) {
    replace({ pathname: '/admin/login' })
  }
}

const checkAuth = (nextState, replace) => {
  if (AdminStore.loggedIn()) {
    replace({ pathname: '/admin' })
  }
}

const Routes = (props) => (
  <Provider store={AdminStore}>
    <Router {...props}>
      <Route path="/admin/login" onEnter={checkAuth} component={LoginPage} />
      <Route path="/admin/resetpassword" onEnter={checkAuth} component={ResetPasswordPage} />
      <Route component={AdminLayout} onEnter={requireAuth}>
        <Route path="/admin" component={Home} />
        <Route path="/admin/users" component={UsersPage} />
        <Route path="/admin/cards" component={Cards} />
        <Route path="/admin/tags" component={Tags} />
        <Route path="/admin/featureswitches" component={FeatureSwitches} />
        <Route path="/admin/invites" component={InvitesPage} />
        <Route path="/admin/moderation" component={Moderation} />
        <Route path="/admin/graph" component={GraphExplorer} />
        <Route path="/admin/rpcconsole" component={UtilitiesPage} />
        <Route path="/admin/graphql" component={GraphQLPage} />
        <Redirect from="/" to="/admin" />
        <Route path="*" component={NotFoundPage} />
      </Route>
    </Router>
  </Provider>

)

export default Routes
