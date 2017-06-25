import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import {FaSpinner}  from 'react-icons/lib/fa';
import { Callout, Colors, Sizes} from 'react-foundation';


import './style.scss';

@inject("store") @observer
export default class NewUserPage extends Component {
  constructor(props){
    super(props)

    this.state = {
      email: "",
      username: "",
      displayname: "",
      password: "",
    }

    this.props.store.getUsersData()

    this.inputChange = this.inputChange.bind(this)
    this.submit = this.submit.bind(this)
  }

  submit(event){
    event.preventDefault()
    console.log("submitpressed")
    this.props.store.newUserRequest(this.state.email, this.state.username, this.state.displayname, this.state.password)
  }

  inputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }



  render() {
    const store = this.props.store

    let shownAlert = null

    //the === true check is because newusersuccess can be null in which case we should show nothing
    if(store.newUserWaiting) {
      shownAlert = (<FaSpinner />)
    } else if (store.newUserSuccess === true) {
      shownAlert = (
        <Callout color={Colors.SUCCESS} size={Sizes.SMALL}>
          <h5>Success!</h5>
        </Callout>
      )
    } else if (store.newUserSuccess === false) {
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
          <label for="email">Email Address</label>
          <input type="email" placeholder="Email" value={this.state.email} name="email" onChange={this.inputChange} required/>
          <label for="username">Username</label>
          <input type="text" value={this.state.username} name="username" placeholder="Username" onChange={this.inputChange} required/>
          <label for="display-name">Display Name</label>
          <input type="text" value={this.state.displayname} name="displayname" placeholder="Name" onChange={this.inputChange} required/>
          <label for="password">Password</label>
          <input type="password" placeholder="Password" value={this.state.password} name="password" onChange={this.inputChange} required/>
          <button type="submit" className="button">Submit</button>
        </form>
      </div>
    );
  }
}
