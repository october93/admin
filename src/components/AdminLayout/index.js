import React, { Component } from 'react';

import MyMenu from '../MyMenu';

import './style.scss';

import logo from './october.svg';

class MainLayout extends Component {
  render() {
    return (
    	<div>
			<div className="AdminLayout">
			  <div className="AdminLayout-header">
			    <img src={logo} className="AdminLayout-logo" alt="logo" />
			    <h2>October Admin</h2>
			  </div>
			  <MyMenu />
			</div>
			<p className="AdminLayout-custom">
			  {this.props.children}
			</p>
      </div>
    );
  }
}
export default MainLayout;