import React, { Component } from 'react';
import { observer, inject  } from 'mobx-react'
import logo from './logo.png';
import './style.scss';

@inject("store") @observer
class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {email: '', password: '', token: this.props.location.query.token};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    if (this.state.token !== undefined) {
      this.props.store.sendLoginRequest(this.state.email, this.state.password, this.state.token)
    }
  }

  handleChange(event) {
    const name = event.target.name;
    this.setState({[name]: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.store.sendLoginRequest(this.state.email, this.state.password)
  }

  render() {
    let errorMessage = null;
    if (this.props.store.loginError !== null) {
      errorMessage = <span className="danger">Not authorized</span>
    }
    return (
      <div className="LoginPage">
        <div className="LoginForm">
          <img className="logo" role="presentation" src={logo} />
          {errorMessage}
          <form action="/" onSubmit={this.handleSubmit}>
            <input type="text" name="email" placeholder="you@example.com" value={this.state.email} onChange={this.handleChange} />
            <input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.handleChange} />
            <input type="submit" value="Sign in" />
          </form>
        </div>
      </div>
    );
  }
}

export default LoginPage;
