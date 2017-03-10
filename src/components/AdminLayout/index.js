import React, { Component } from 'react';

import MyMenu from '../MyMenu';

import './style.scss';

import logo from './october.svg';

import classnames from 'classnames';

const menuItems = [
    {name: "Dashboard", path: "/admin"},
    {name: "Users", path: "/admin/users"},
    {name: "Cards", path: "/admin/newCard"},
    {name: "Invites", path: "/admin/invites"},
    {name: "Importers", path: "/admin/importers"},
    {name: "Graph", path: "/admin/graph"},
    {name: "Demo", path: "/admin/demo"},

]

class AdminLayout extends Component {
  render() {
    const { className, ...props } = this.props;

    return (
		<div className={classnames("AdminLayout", className)}>
			<div className="AdminLayout-header">
			    <img src={logo} className="AdminLayout-logo" alt="logo" />
			    <h2>October Admin</h2>
			</div>
			<MyMenu menuItems={menuItems} />
			<div className="AdminLayout-custom">
				{this.props.children}
			</div>
		</div>
    );
  }
}
export default AdminLayout;
