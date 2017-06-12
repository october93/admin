// src/routes.js
import React from 'react';
import { Router, Route, Redirect } from 'react-router';

import { Provider } from "mobx-react"

import AdminLayout from './components/AdminLayout';
import DashPage from './components/DashPage';
import UsersPage from './components/UsersPage';
import NotFoundPage from './components/NotFoundPage';
import GraphPage from './components/GraphPage';
import NewUserPage from './components/NewUserPage'
import NewCardPage from './components/NewCardPage'
import UtilitiesPage from './components/UtilitiesPage'
import InvitesPage from './components/InvitesPage'
import DemoPage from './components/DemoPage'
import SimulatorPage from "./components/SimulatorPage"
import GraphQLPage from './components/GraphQLPage'

import AdminStore from "./store/AdminStore"

const requireAuth = (nextState, replace) => {
  if (!AdminStore.auth.loggedIn()) {
    replace({ pathname: '/admin/login' })
  }
}

const checkAuth = (nextState, replace) => {
  if (AdminStore.auth.loggedIn()) {
    replace({ pathname: '/admin' })
  } else if (!location.hash) {
    AdminStore.auth.login()
  }
}

const Routes = (props) => (
  <Provider store={AdminStore}>
    <Router {...props}>
      <Route path="/admin/login" onEnter={checkAuth} />
      <Route component={AdminLayout} onEnter={requireAuth}>
        <Route path="/admin" component={DashPage} />
        <Route path="/admin/users" component={UsersPage} />
        <Route path="/admin/newCard" component={NewCardPage} />
        <Route path="/admin/graph" onEnter={() => AdminStore.getGraphData()} component={GraphPage} />
        <Route path="/admin/newUser" component={NewUserPage} />
        <Route path="/admin/utilities" onEnter={() => AdminStore.hnStatusRequest()} component={UtilitiesPage} />
        <Route path="/admin/invites" component={InvitesPage} />
        <Route path="/admin/demo" onEnter={() => AdminStore.getDemoRequest()} component={DemoPage} />
        <Route path="/admin/graphql" component={GraphQLPage} />
        <Route path="/admin/sim" component={SimulatorPage} />
        <Redirect from="/" to="/admin" />
        <Route path="*" component={NotFoundPage} />
      </Route>
    </Router>
  </Provider>

);

export default Routes;
