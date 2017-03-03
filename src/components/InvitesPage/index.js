import React, { Component } from 'react';
import classnames from 'classnames';
import { observer, inject } from 'mobx-react';
import { FaSpinner }  from 'react-icons/lib/fa';
import { Link } from 'react-router'

import {Callout, Button, Colors, Sizes, Label } from 'react-foundation';


@inject("store") @observer
export default class InvitesPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      inviterid: "",
      inviteeid: "",
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
    this.props.store.inviteRequest(this.state.inviterid, this.state.inviteeid)
  }

  render() {
    const { className, ...props } = this.props
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
          <label>Inviter Username or Node ID</label>
          <input type="text" placeholder="Name/ID" name="inviterid" onChange={this.inputChange} required/>
          <label>Invitee Username or Node ID</label>
          <input type="text" placeholder="Name/ID" name="inviteeid" onChange={this.inputChange} required/>
          <button type="submit" className="button">Submit</button>
        </form>
      </div>
    )
  }
}
