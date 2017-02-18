// src/components/Landing/index.js
import React, { Component } from 'react';
import classnames from 'classnames';

import logo from './october.svg';
import './style.css';

class Landing extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}

  render() {
    const { className, ...props } = this.props;
    return (
      <div className={classnames('Landing', className)} {...props}>
        <div className="Landing-header">
          <img src={logo} className="Landing-logo" alt="logo" />
          <h2>Welcome to October</h2>
        </div>
        <p className="Landing-intro">
          <p>Hello. We have Router Support now.</p>
          <p>Pages: <a href="/about">About</a></p>
        </p>
      </div>
    );
  }
}

export default Landing;