import React from 'react'
import { Router, Route, Redirect } from 'react-router'

import AdminLayout from './components/AdminLayout'

import LoginPage from './scenes/Login'
import Announcements from './scenes/Announcements'
import Actions from './scenes/Actions'
import NotFoundPage from './scenes/NotFound'
import UtilitiesPage from './scenes/RPCConsole'
import GraphQLPage from './scenes/GraphQL'
import ResetPassword from "./scenes/ResetPassword"
import InvitesPage from "./scenes/Invites"
import Home from './scenes/Home';
import Tags from './scenes/Tags';
import FeatureSwitches from './scenes/FeatureSwitches';
import Moderation from './scenes/Moderation';
import UsersPage from './scenes/Users';
import Waitlist from './scenes/Waitlist'
import WhoIsOnline from './scenes/WhoIsOnline'
import Engagement from './scenes/Engagement'
import Channels from './scenes/Channels'

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
      <Route path="/admin/channels" component={Channels} />
      <Route path="/admin/actions" component={Actions} />
			<Route path="/admin/users/engagement" component={Engagement} />
      <Route path="/admin/tags" component={Tags} />
      <Route path="/admin/featureswitches" component={FeatureSwitches} />
      <Route path="/admin/invites" component={InvitesPage} />
      <Route path="/admin/moderation" component={Moderation} />
      <Route path="/admin/rpcconsole" component={UtilitiesPage} />
      <Route path="/admin/graphql" component={GraphQLPage} />
      <Route path="/admin/waitlist" component={Waitlist} />
      <Route path="/admin/whoisonline" component={WhoIsOnline} />
      <Route path="/admin/announcements" component={Announcements} />
      <Redirect from="/" to="/admin" />
      <Route path="*" component={NotFoundPage} />
    </Route>
  </Router>
)

export default Routes
