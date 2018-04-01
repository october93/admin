import React from 'react'
import { Router, Route, Redirect } from 'react-router'

import AdminLayout from './components/AdminLayout'

import LoginPage from './scenes/Login'
import NotFoundPage from './scenes/NotFound'
import UtilitiesPage from './scenes/RPCConsole'
import GraphQLPage from './scenes/GraphQL'
import ResetPassword from "./scenes/ResetPassword"
import InvitesPage from "./scenes/Invites"
import AdminStore from "./store/AdminStore"
import Home from './scenes/Home';
import Cards from './scenes/Cards';
import Tags from './scenes/Tags';
import GraphExplorer from './scenes/GraphExplorer';
import FeatureSwitches from './scenes/FeatureSwitches';
import Moderation from './scenes/Moderation';
import UsersPage from './scenes/Users';
import Waitlist from './scenes/Waitlist'

const loggedIn = () => {
  let session = localStorage.getItem("session")
  let parsedSession = null
  if (session !== undefined) {
    parsedSession = JSON.parse(session)
  }
  if (parsedSession === null) {
    return false
  }
  return true
}

const requireAuth = (nextState, replace) => {
  if (!loggedIn()) {
    replace({ pathname: '/admin/login' })
  }
}

const checkAuth = (nextState, replace) => {
  if (loggedIn()) {
    replace({ pathname: '/admin' })
  }
}

const Routes = (props) => (
  <Router {...props}>
    <Route path="/admin/login" onEnter={checkAuth} component={LoginPage} />
    <Route path="/admin/resetpassword" onEnter={checkAuth} component={ResetPassword} />
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
      <Route path="/admin/waitlist" component={Waitlist} />
      <Redirect from="/" to="/admin" />
      <Route path="*" component={NotFoundPage} />
    </Route>
  </Router>
)

export default Routes
