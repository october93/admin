import React, { Component } from 'react';
import { Link, Colors } from 'react-foundation'

import MyMenu from '../MyMenu';

import { observer, inject } from 'mobx-react'
import ReactModal from 'react-modal';

import './style.scss';

import logo from './october.svg';

import classnames from 'classnames';

const menuItems = [
  {name: "Users Dashboard", path: "/admin/users"},
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

  render() {
    const { className } = this.props;
    const profile = JSON.parse(localStorage.getItem("session"))

    return (
    		<div className={classnames("AdminLayout", className)}>
          <ReactModal
             isOpen={this.state.showModal}
             contentLabel="Minimal Modal Example"
          >
          <label>Summary:</label>
          <input type="text" value={this.state.issueSummary} name="issueSummary" onChange={this.inputChange} required/>
            <label>Detail:</label>
          <input type="text" value={this.state.issueDetail} name="issueDetail"   onChange={this.inputChange} required />

            <Link color={Colors.SECONDARY} onClick={this.handleCloseModal}>Close Bug</Link>
              <Link onClick={this.submitAndCloseModal}>Submit Bug</Link>
          </ReactModal>

          <div className="AdminLayout-profilename">
            Welcome {profile ? profile.username : null}
          </div>
          <a href={"/admin"}>
            <div className="AdminLayout-header">
      			    <img src={logo} className="AdminLayout-logo" alt="logo" />
      			    <h2>October Admin</h2>
      			</div>
          </a>

          <div className="AdminLayout-logout">
            <Link color={Colors.ALERT} onClick={this.handleOpenModal}>Report Bug</Link>
            <Link onClick={this.props.store.logout.bind(this)}>Logout</Link>
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
