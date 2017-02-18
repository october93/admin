import React, { Component } from 'react';

import './style.scss';

import {Menu, MenuItem, Alignments} from 'react-foundation';

export default class MyMenu extends Component {
  render() {
    return (
      <div className="MyMenu">
        <Menu alignment={Alignments.CENTER} isExpanded>
          <MenuItem><a>Home</a></MenuItem>
          <MenuItem><a>Users</a></MenuItem>
          <MenuItem><a>Cards</a></MenuItem>
          <MenuItem><a>Settings</a></MenuItem>
          <MenuItem><a>Experiments</a></MenuItem>
        </Menu>
      </div>
    );
  }
}