// src/routes.js
import React from 'react';
import { Router, Route } from 'react-router';

import { Provider } from "mobx-react"

import AdminLayout from './components/AdminLayout';
import DashPage from './components/DashPage';
import UsersPage from './components/UsersPage';
import NotFoundPage from './components/NotFoundPage';
import GraphPage from './components/GraphPage';
import NewUserPage from './components/NewUserPage'
import NewCardPage from './components/NewCardPage'


import AdminStore from "./store/AdminStore"

const Routes = (props) => (
  <Provider store={AdminStore}>
    <Router {...props}>
      <Route component={AdminLayout}>
        <Route path="/" component={DashPage} />
        <Route path="/users" component={UsersPage} />
        <Route path="/newCard" component={NewCardPage} />
        <Route path="/graph" onEnter={() => AdminStore.getGraphData()} component={GraphPage} />
        <Route path="/newUser" component={NewUserPage} />
        <Route path="*" component={NotFoundPage} />
      </Route>
    </Router>
  </Provider>

);

export default Routes;
