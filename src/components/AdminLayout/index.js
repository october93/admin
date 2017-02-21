import React, { Component } from 'react';

import MyMenu from '../MyMenu';

import './style.scss';

import logo from './october.svg';

import classnames from 'classnames';

class AdminLayout extends Component {
  render() {
    const { className, ...props } = this.props;
    return (

		<div className={classnames("AdminLayout", className)} {...props}>
			<div className="AdminLayout-header">
			    <img src={logo} className="AdminLayout-logo" alt="logo" />
			    <h2>October Admin</h2>
			</div>
			<MyMenu />
			<p className="AdminLayout-custom">
				{this.props.children}
			</p>
		</div>
    );
  }
}
export default AdminLayout;