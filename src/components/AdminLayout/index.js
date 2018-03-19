import React, { Component } from 'react';
import { Link } from 'react-router'
import { observer, inject } from 'mobx-react'

import './style.scss';

import logo from './logo-light.png';

const menuItems = [
  {name: "Users", path: "/admin/users"},
  {name: "Cards", path: "/admin/cards"},
  {name: "Tags", path: "/admin/tags"},
  {name: "Invites", path: "/admin/invites"},
  {name: "Utilities", path: "/admin/connect"},
  {name: "Moderation", path: "/admin/moderation"},
  {name: "Console", path: "/admin/rpcconsole"},
  {name: "Graph", path: "/admin/graph"},
  {name: "GraphQL", path: "/admin/graphql"},
  {name: "Report Bug", path: "/admin/reportbug"},
  {name: "Feature Switches", path: "/admin/featureswitches"},
]

@inject("store") @observer
class AdminLayout extends Component {
  state = {
    showModal: false,
    issueSummary: "",
    issueDetail: "",
  }

  renderMenuItems = () => {
    return menuItems.map(item => (
      <div key={item.path} className="menuItem">
        <Link key={item.path} to={item.path}>{item.name}</Link>
      </div>
    ))
  }

  render() {
    const profile = JSON.parse(localStorage.getItem("session"))

    return (
    		<div className="top">
          <div className="verticalMenu">
            <Link to="/">
              <div className="header">
                <img src={logo} className="logo" alt="logo" />
                <span className="logoText">Admin</span>
              </div>
            </Link>
            {this.renderMenuItems()}
            <div className="bottomMenu">
              <div className="menuItem">
                <div className="loggedInAs">
                  Welcome,
                </div>
                {profile ? profile.username : "User"}
              </div>
              <a className="menuItem" onClick={this.props.store.logout.bind(this)}>Logout</a>
            </div>
          </div>
          <div className="container">
            <div className="menuPadding" />

      			<div className="page">
      				{this.props.children}
      			</div>
          </div>
    		</div>

    );
  }
}
export default AdminLayout;
