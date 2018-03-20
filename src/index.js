// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'
import './index.scss';

let endpoint = `${location.origin}/graphql`
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  endpoint = 'http://localhost:9000/graphql'
}

const store = configureStore(endpoint)

ReactDOM.render(
  <Provider store={store}>
    <Routes history={browserHistory} />
  </Provider>,
  document.getElementById('root')
);
