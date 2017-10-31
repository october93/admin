import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { FaSpinner }  from 'react-icons/lib/fa';

import {Callout, Colors, Sizes } from 'react-foundation';


@inject("store") @observer
export default class ConnectPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      users: '[""]',
      password: '',
    }

    this.inputChange = this.inputChange.bind(this)
    this.submit = this.submit.bind(this)
  }

  inputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  submit(event){
    event.preventDefault()
    this.props.store.inviteRequest(this.state.users)
  }

  pressConnectAll = (event) => {
    event.preventDefault()
    this.props.store.connectAllUsersRequest()
  }

  changeText = (event) => {
    this.props.store.demoData = event.target.value
  }

  submitDemo = (event) => {
    event.preventDefault()

    this.props.store.setDemoRequest(this.props.store.demoData)
  }


  handleChange = (event) => {
    const name = event.target.name;
    this.setState({[name]: event.target.value});
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.store.updateSettings(this.state.password)
  }

  render() {
    const store = this.props.store

    let shownAlert = null

    //the === true check is because newusersuccess can be null in which case we should show nothing
    if(store.inviteStatus === "waiting") {
      shownAlert = (<FaSpinner />)
    } else if (store.inviteStatus === "success") {
      shownAlert = (
        <Callout color={Colors.SUCCESS} size={Sizes.SMALL}>
          <h5>Success!</h5>
        </Callout>
      )
    } else if (store.inviteStatus === "failure") {
      shownAlert = (
        <Callout color={Colors.ALERT} size={Sizes.SMALL}>
          <h5>Failed.</h5>
        </Callout>
      )
    }

    let shownDemoAlert = null

    if(store.setDemoStatus === "waiting") {
      shownDemoAlert = (<FaSpinner />)
    } else if (store.setDemoStatus === "success") {
      shownDemoAlert = (
        <Callout color={Colors.SUCCESS} size={Sizes.SMALL}>
          <h5>Success!</h5>
        </Callout>
      )
    } else if (store.setDemoStatus === "failure") {
      shownDemoAlert = (
        <Callout color={Colors.ALERT} size={Sizes.SMALL}>
          <h5>Failed.</h5>
        </Callout>
      )
    }

    let errorMessage = null;
    if (this.props.store.updateSettingsError !== null) {
      errorMessage = <span className="danger">{this.props.store.updateSettingsError}</span>
    }

    return (
      <div className="pageMargins">
        <div>
          <h3>Connect Users</h3>
          {shownAlert}
          <form onSubmit={this.submit}>
            <label>Array of users to connect by username</label>
            <input type="text" value={this.state.users} placeholder="Name/ID" name="users" onChange={this.inputChange} required/>
            <button type="submit" className="button">Submit</button>
          </form>
          <form onSubmit={this.pressConnectAll}>
            <button type="submit" className="button">Connect All Users</button>
          </form>
        </div>

        <div className="SettingsPage">
          <h3>Change Password</h3>
          {errorMessage}
          <form action="/" onSubmit={this.handleSubmit}>
            <input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.handleChange} />
            <button type="submit" className="button">Update</button>
          </form>
        </div>

        <div>
          <h3>Set Demo</h3>
          {shownDemoAlert}
          <form onSubmit={this.submitDemo}>
            <textarea value={this.props.store.demoData} onChange={this.changeText}></textarea>
            <button type="submit" className="button">Update</button>
          </form>
        </div>
      </div>

    )
  }
}
