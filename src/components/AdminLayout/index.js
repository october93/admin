import React, { Component } from 'react';

import MyMenu from '../MyMenu';

import './style.scss';

import logo from './october.svg';

import classnames from 'classnames';

const menuItems = [
  {name: "Dashboard", path: "/admin"},
  {name: "Users", path: "/admin/users"},
  {name: "Sessions", path: "/admin/sessions"},
  {name: "Cards", path: "/admin/newCard"},
  {name: "Invites", path: "/admin/invites"},
  {name: "Utilities", path: "/admin/utilities"},
  {name: "Graph", path: "/admin/graph"},
  {name: "Demo", path: "/admin/demo"},
  {name: "Simulator", path: "/admin/sim"},
  {name: "GraphQL", path: "/admin/graphql"},
]

class AdminLayout extends Component {
  render() {
    const { className } = this.props;

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
