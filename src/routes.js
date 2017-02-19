// src/routes.js
import React from 'react';
import { Router, Route } from 'react-router';

import AdminLayout from './components/AdminLayout';
import LandingPage from './components/LandingPage';
import UsersPage from './components/UsersPage';
import NotFoundPage from './components/NotFoundPage';

const Routes = (props) => (
  <Router {...props}>
  	<Route component={AdminLayout}>
	    <Route path="/" component={LandingPage} />
	    <Route path="/users" component={UsersPage} />
	    <Route path="*" component={NotFoundPage} />
	</Route>
  </Router>
);

export default Routes;