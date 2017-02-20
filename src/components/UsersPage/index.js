import React, { Component } from 'react';
import classnames from 'classnames';

import './style.scss';

export default class UsersPage extends Component {
  render() {
    const { className, ...props } = this.props;
    return (
      <div className={classnames("UsersPage", className)} {...props}>
        <h1>
          About
        </h1>
      </div>
    );
  }
}