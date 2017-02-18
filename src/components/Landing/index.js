import React, { Component } from 'react';

import logo from './october.svg';
import './style.css';

import Menu from '../Menu';

import {Switch} from 'react-foundation';


class Landing extends Component {
  render() {
    return (
      <div className="Landing">
        <div className="Landing-header">
          <img src={logo} className="Landing-logo" alt="logo" />
          <h2>Welcome to October</h2>
        </div>
        <p className="Landing-intro">
          Hello. We have Router Support now.
          Pages: <a href="/about">About</a>
        </p>
        <Menu />
        <Switch />
      </div>
    );
  }
}

export default Landing;