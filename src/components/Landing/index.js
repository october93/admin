import React, { Component } from 'react';

import logo from './october.svg';
import './style.scss';

import MyMenu from '../MyMenu';

// import {Switch} from 'react-foundation';


class Landing extends Component {
  render() {
    return (
      <div className="Landing">
        <div className="Landing-header">
          <img src={logo} className="Landing-logo" alt="logo" />
          <h2>October Admin</h2>
        </div>
        <MyMenu />
        <p className="Landing-intro">
          Hello. We have Router Support now.
        </p>
      </div>
    );
  }
}

export default Landing;