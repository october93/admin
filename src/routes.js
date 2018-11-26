import React, { lazy, Suspense } from 'react'
import { Router, Route, Redirect } from 'react-router'


import LoginPage from './scenes/Login'
import ResetPassword from "./scenes/ResetPassword"

const AdminLayout = lazy(() => import('./components/AdminLayout'))
const Announcements = lazy(() => import('./scenes/Announcements'))
const Actions = lazy(() => import('./scenes/Actions'))
const NotFoundPage = lazy(() => import('./scenes/NotFound'))
const UtilitiesPage = lazy(() => import('./scenes/RPCConsole'))
const GraphQLPage = lazy(() => import('./scenes/GraphQL'))
const InvitesPage = lazy(() => import("./scenes/Invites"))
const Home = lazy(() => import('./scenes/Home'))
const Tags = lazy(() => import('./scenes/Tags'))
const FeatureSwitches = lazy(() => import('./scenes/FeatureSwitches'))
const Moderation = lazy(() => import('./scenes/Moderation'))
const UsersPage = lazy(() => import('./scenes/Users'))
const Waitlist = lazy(() => import('./scenes/Waitlist'))
const WhoIsOnline = lazy(() => import('./scenes/WhoIsOnline'))
const Engagement = lazy(() => import('./scenes/Engagement'))
const Channels = lazy(() => import('./scenes/Channels'))

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
		<Suspense fallback={<div>Loading...</div>}>
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
		</Suspense>
  </Router>
)

export default Routes
