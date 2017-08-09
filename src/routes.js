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
import NewCardPage from './components/NewCardPage'
import UtilitiesPage from './components/UtilitiesPage'
import InvitesPage from './components/InvitesPage'
import DemoPage from './components/DemoPage'
import SimulatorPage from "./components/SimulatorPage"
import GraphQLPage from './components/GraphQLPage'
import CardsPage from './components/CardsPage'
import TagsPage from "./components/TagsPage"

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
      <Route component={AdminLayout} onEnter={requireAuth}>
        <Route path="/admin" onEnter={() => AdminStore.getDashboardMetrics()} component={DashPage} />
        <Route path="/admin/users" onEnter={() => AdminStore.getUsersData()} component={UsersPage} />
        <Route path="/admin/sessions" component={SessionsPage} />
        <Route path="/admin/tags" onEnter={() => AdminStore.getTags()}component={TagsPage} />
        <Route path="/admin/cards" onEnter={() => {
          AdminStore.getCardsData()
          AdminStore.getUsersData()}} component={CardsPage} />
        <Route path="/admin/newCard" component={NewCardPage} />
        <Route path="/admin/graph" component={GraphPage} />
        <Route path="/admin/newUser" component={NewUserPage} />
        <Route path="/admin/utilities" component={UtilitiesPage} />
        <Route path="/admin/invites" onEnter={() => AdminStore.getUsersData()} component={InvitesPage} />
        <Route path="/admin/demo" onEnter={() => AdminStore.getDemoRequest()} component={DemoPage} />
        <Route path="/admin/graphql" component={GraphQLPage} />
        <Route path="/admin/sim" onEnter={() => AdminStore.getSimulatorDataRequest()} component={SimulatorPage} />
        <Redirect from="/" to="/admin" />
        <Route path="*" component={NotFoundPage} />
      </Route>
    </Router>
  </Provider>

);

export default Routes;
