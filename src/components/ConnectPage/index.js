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

    return (
      <div>
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
    )
  }
}
