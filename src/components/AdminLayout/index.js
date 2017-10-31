import React, { Component } from 'react';
import { Link as FLink, Colors } from 'react-foundation'
import { Link } from 'react-router'
import { observer, inject } from 'mobx-react'
import ReactModal from 'react-modal';

import './style.scss';

import logo from './logo-light.png';

import classnames from 'classnames';

const menuItems = [
  {name: "Users", path: "/admin/users"},
  {name: "Invites", path: "/admin/invites"},
  {name: "Utilities", path: "/admin/connect"},
  {name: "Console", path: "/admin/rpcconsole"},
  {name: "Graph", path: "/admin/graph"},
  {name: "GraphQL", path: "/admin/graphql"},
]

@inject("store") @observer
class AdminLayout extends Component {
  state = {
    showModal: false,
    issueSummary: "",
    issueDetail: "",
  }
  handleOpenModal = () => {
    this.setState({ showModal: true });
  }

  handleCloseModal = () => {
    this.setState({
      showModal: false,
      issueSummary: "",
      issueDetail: "",
    })
  }

  submitAndCloseModal = () => {
    this.props.store.reportBugRequest(this.state.issueSummary, this.state.issueDetail)
    this.handleCloseModal()
  }


  inputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  renderMenuItems = () => {
    return menuItems.map(item => (
      <div className="menuItem">
        <Link key={item.path} to={item.path}>{item.name}</Link>
      </div>
    ))
  }

  render() {
    const { className } = this.props;
    const profile = JSON.parse(localStorage.getItem("session"))

    return (
    		<div className="container">
          <div className="verticalMenu">
            <div className="header">
              <img src={logo} className="logo" alt="logo" />
              <span className="logoText">Admin</span>
            </div>
            {this.renderMenuItems()}
            <a className="menuItem" onClick={this.handleOpenModal}>Report Bug</a>

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
          <ReactModal
             isOpen={this.state.showModal}
             contentLabel="Minimal Modal Example"
          >
          <label>Summary:</label>
          <input type="text" value={this.state.issueSummary} name="issueSummary" onChange={this.inputChange} required/>
            <label>Detail:</label>
          <input type="text" value={this.state.issueDetail} name="issueDetail"   onChange={this.inputChange} required />

            <FLink color={Colors.SECONDARY} onClick={this.handleCloseModal}>Close</FLink>
            <FLink onClick={this.submitAndCloseModal}>Submit Bug</FLink>
          </ReactModal>

    			<div className="page">
    				{this.props.children}
    			</div>
    		</div>

    );
  }
}
export default AdminLayout;
