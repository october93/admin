// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'
import './index.scss';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <Routes history={browserHistory} />
  </Provider>,
  document.getElementById('root')
);
