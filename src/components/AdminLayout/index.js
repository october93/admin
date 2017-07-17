import React, { Component } from 'react';
import { Link } from 'react-foundation'

import MyMenu from '../MyMenu';
import { observer, inject } from 'mobx-react'

import './style.scss';

import logo from './october.svg';

import classnames from 'classnames';

const menuItems = [
  {name: "Dashboard", path: "/admin"},
  {name: "Users", path: "/admin/users"},
  {name: "Sessions", path: "/admin/sessions"},
  {name: "Cards", path: "/admin/newCard"},
  {name: "Connect", path: "/admin/invites"},
  {name: "Utilities", path: "/admin/utilities"},
  {name: "Graph", path: "/admin/graph"},
  {name: "Demo", path: "/admin/demo"},
  {name: "Simulator", path: "/admin/sim"},
  {name: "GraphQL", path: "/admin/graphql"},
]

@inject("store") @observer
class AdminLayout extends Component {
  render() {
    const { className } = this.props;
    const profile = JSON.parse(localStorage.getItem("profile"))

    return (
		<div className={classnames("AdminLayout", className)}>
      <div className="AdminLayout-profilename">
        Welcome {profile ? profile.given_name : null}
      </div>
			<div className="AdminLayout-header">
			    <img src={logo} className="AdminLayout-logo" alt="logo" />
			    <h2>October Admin</h2>
			</div>
      <Link className="AdminLayout-logout" onClick={this.props.store.auth.logout.bind(this)}>Logout</Link>
			<MyMenu menuItems={menuItems} />
			<div className="AdminLayout-custom">
				{this.props.children}
			</div>
		</div>
    );
  }
}
export default AdminLayout;
