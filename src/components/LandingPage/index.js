import React, { Component } from 'react';

import logo from './october.svg';
import './style.scss';

import MyMenu from '../MyMenu';

// import {Switch} from 'react-foundation';


class LandingPage extends Component {
  render() {
    return (
      <div className="LandingPage">
        <div className="LandingPage-header">
          <img src={logo} className="LandingPage-logo" alt="logo" />
          <h2>October Admin</h2>
        </div>
        <MyMenu />
        <p className="LandingPage-intro">
          Hello. We have Router Support now.
        </p>
      </div>
    );
  }
}

export default LandingPage;