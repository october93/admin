import React from 'react';
import { Router, Route, Redirect } from 'react-router';

import { Provider } from "mobx-react"

import AdminLayout from './components/AdminLayout';
import LoginPage from './components/LoginPage';
import DashPage from './components/DashPage';
import Cards from './scenes/Cards';
import UsersPage from './components/UsersPage';
import NotFoundPage from './components/NotFoundPage';
import GraphExplorer from './scenes/GraphExplorer';
import NewUserPage from './components/NewUserPage'
import UtilitiesPage from './components/UtilitiesPage'
import ConnectPage from './components/ConnectPage'
import GraphQLPage from './components/GraphQLPage'
import ResetPasswordPage from "./components/ResetPasswordPage"
import InvitesPage from "./components/InvitesPage"
import ReportBugPage from "./components/ReportBugPage"
import AdminStore from "./store/AdminStore"


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
        <Route path="/admin" onEnter={() => AdminStore.getDashboardMetrics()} component={DashPage} />
        <Route path="/admin/users" onEnter={() => AdminStore.getUsersData()} component={UsersPage} />
        <Route path="/admin/cards" component={Cards} />
        <Route path="/admin/invites" component={InvitesPage} />
        <Route path="/admin/graph" component={GraphExplorer} />
        <Route path="/admin/newUser" component={NewUserPage} />
        <Route path="/admin/rpcconsole" component={UtilitiesPage} />
        <Route path="/admin/reportbug" component={ReportBugPage} />
        <Route path="/admin/connect" onEnter={() => AdminStore.getUsersData()} component={ConnectPage} />
        <Route path="/admin/graphql" component={GraphQLPage} />
        <Redirect from="/" to="/admin" />
        <Route path="*" component={NotFoundPage} />
      </Route>
    </Router>
  </Provider>

);

export default Routes;
