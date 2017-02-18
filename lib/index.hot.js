// css imports
require('../assets/css/october_web/core.scss')

// javascript
import React from 'react'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'

import App from './App'


const root = document.getElementById('october_web')



ReactDOM.render((
  <AppContainer>
    <App/>
  </AppContainer>
), root)


if (module.hot) {
  module.hot.accept('./App', () => {
    ReactDOM.render((
      <AppContainer>
        <App/>
      </AppContainer>
    ), root);
  })
}
