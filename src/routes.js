// src/routes.js
import React from 'react';
import { Router, Route, Redirect } from 'react-router';

import { Provider } from "mobx-react"

import AdminLayout from './components/AdminLayout';
import LoginPage from './components/LoginPage';
import DashPage from './components/DashPage';
import UsersPage from './components/UsersPage';
import SessionsPage from './components/SessionsPage';
import NotFoundPage from './components/NotFoundPage';
import GraphPage from './components/GraphPage';
import NewUserPage from './components/NewUserPage'
import UtilitiesPage from './components/UtilitiesPage'
import ConnectPage from './components/ConnectPage'
import DemoPage from './components/DemoPage'
import SimulatorPage from "./components/SimulatorPage"
import GraphQLPage from './components/GraphQLPage'
import SettingsPage from "./components/SettingsPage"
import ResetPasswordPage from "./components/ResetPasswordPage"
import InvitesPage from "./components/InvitesPage"

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
        <Route path="/admin/sessions" component={SessionsPage} />
        <Route path="/admin/invites" component={InvitesPage} />
        <Route path="/admin/graph" component={GraphPage} />
        <Route path="/admin/newUser" component={NewUserPage} />
        <Route path="/admin/rpcconsole" component={UtilitiesPage} />
        <Route path="/admin/connect" onEnter={() => AdminStore.getUsersData()} component={ConnectPage} />
        <Route path="/admin/demo" onEnter={() => AdminStore.getDemoRequest()} component={DemoPage} />
        <Route path="/admin/graphql" component={GraphQLPage} />
        <Route path="/admin/sim" onEnter={() => AdminStore.getSimulatorDataRequest()} component={SimulatorPage} />
        <Route path="/admin/settings" component={SettingsPage} />
        <Redirect from="/" to="/admin" />
        <Route path="*" component={NotFoundPage} />
      </Route>
    </Router>
  </Provider>

);

export default Routes;
