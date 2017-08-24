import React, { Component } from 'react';
import { observer, inject  } from 'mobx-react'
import './style.scss';

@inject("store") @observer
class ResetPasswordPage extends Component {
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
    this.props.store.sendPasswordResetRequest(this.state.email, this.state.password)
  }

  render() {
    return (
      <div className="ResetPasswordPage">
        <div className="ResetPasswordForm">
          <form action="/" onSubmit={this.handleSubmit}>
            <input type="text" name="email" placeholder="you@example.com" value={this.state.email} onChange={this.handleChange} />
            <input type="submit" value="Reset Password" />
          </form>
        </div>
      </div>
    );
  }
}

export default ResetPasswordPage;
