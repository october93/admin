import React, { Component } from 'react';

import './style.scss';

import {Menu, MenuItem, Alignments} from 'react-foundation';

export default class MyMenu extends Component {
  render() {
    return (
      <div className="MyMenu">
        <Menu alignment={Alignments.CENTER} isExpanded>
          <MenuItem><a href="/">Home</a></MenuItem>
          <MenuItem><a href="/users/">Users</a></MenuItem>
          <MenuItem><a href="/cards/">Cards</a></MenuItem>
          <MenuItem><a href="/settings/">Settings</a></MenuItem>
          <MenuItem><a href="/experiments/">Experiments</a></MenuItem>
          <MenuItem><a href="/graph/">Graph</a></MenuItem>
        </Menu>
      </div>
    );
  }
}
