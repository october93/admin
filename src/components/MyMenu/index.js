import React, { Component } from 'react';

import './style.scss';

import classnames from 'classnames';

import {Menu, MenuItem, Alignments} from 'react-foundation';

import { Link } from 'react-router'


export default class MyMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuItems: props.menuItems
    };
  }
  renderMenuItems() {
    return this.state.menuItems.map(item => (
        <MenuItem key={item.path} ><Link to={item.path}>{item.name}</Link></MenuItem>
      )
    )
  }
  render() {
    const { className } = this.props;
    return (
      <div className={classnames("MyMenu", className)}>
        <Menu className={"vertical medium-horizontal"} alignment={Alignments.CENTER} isExpanded>
          {this.renderMenuItems()}
        </Menu>
      </div>
    );
  }
}
