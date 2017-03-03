// src/routes.js
import React from 'react';
import { Router, Route } from 'react-router';

import { Provider } from "mobx-react"

import AdminLayout from './components/AdminLayout';
import DashPage from './components/DashPage';
import UsersPage from './components/UsersPage';
import NotFoundPage from './components/NotFoundPage';
import GraphPage from './components/GraphPage';
import AdminStore from "./store/AdminStore"

const Routes = (props) => (
  <Provider store={AdminStore}>
    <Router {...props}>
      <Route component={AdminLayout}>
        <Route path="/" component={DashPage} />
        <Route path="/users" component={UsersPage} />
        <Route path="/graph" component={GraphPage} />
        <Route path="*" component={NotFoundPage} />
      </Route>
    </Router>
  </Provider>

);

export default Routes;
