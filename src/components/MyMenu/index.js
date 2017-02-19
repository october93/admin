import React, { Component } from 'react';

import './style.scss';

import classnames from 'classnames';

import {Menu, MenuItem, Alignments} from 'react-foundation';

export default class MyMenu extends Component {
  render() {
    const { className, ...props } = this.props;
    return (
      <div className={classnames("MyMenu", className)} {...props}>
        <Menu alignment={Alignments.CENTER} isExpanded>
          <MenuItem><a href="/">Dashboard</a></MenuItem>
          <MenuItem><a href="/users/">Users</a></MenuItem>
          <MenuItem><a href="/cards/">Cards</a></MenuItem>
          <MenuItem><a href="/settings/">Settings</a></MenuItem>
          <MenuItem><a href="/experiments/">Experiments</a></MenuItem>
        </Menu>
      </div>
    );
  }
}