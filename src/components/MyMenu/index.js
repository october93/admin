import React, { Component } from 'react';

import './style.scss';

import classnames from 'classnames';

import {Menu, MenuItem, Alignments} from 'react-foundation';

export default class MyMenu extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      menuItems: [
        {name: "Dashboard", path: "/"},
        {name: "Users", path: "/users/"},
        {name: "Cards", path: "/cards/"},
        {name: "Settings", path: "/settings/"},
        {name: "Experiments", path: "/experiments/"},
        {name: "Graph", path: "/graph/"}
      ]
    };
  }
  renderMenuItems() {
    return this.state.menuItems.map(item => (
        <MenuItem><a href={item.path}>{item.name}</a></MenuItem>
      )
    )
  }
  render() {
    const { className, ...props } = this.props;
    return (
      <div className={classnames("MyMenu", className)} {...props}>
        <Menu alignment={Alignments.CENTER} isExpanded>
          {this.renderMenuItems()}
        </Menu>
      </div>
    );
  }
}