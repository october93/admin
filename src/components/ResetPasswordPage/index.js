import React, { Component } from 'react';
import { observer, inject  } from 'mobx-react'
import glamorous from "glamorous"

const ResetPasswordContainer = glamorous.div({
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
})

const ResetPasswordForm = glamorous.div({
  marginBottom: "20em",
})

const Submit = glamorous.input({
  cursor: "pointer",
  border: "none",
  width: "10em",
  color: "#fff",
  borderRadius: "5px",
  display: "block",
  margin: "0 auto",
  backgroundColor: "#1aafdb",
  textAlign: "center",
  padding: "1em",
  "&:hover": {
    backgroundColor: "#1a9fdb",
  },
  "&:active": {
    backgroundColor: "#1a88db",
  },
})


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
      <ResetPasswordContainer>
        <ResetPasswordForm>
          <form action="/" onSubmit={this.handleSubmit}>
            <input type="text" name="email" placeholder="you@example.com" value={this.state.email} onChange={this.handleChange} />
            <Submit type="submit" value="Reset Password" />
          </form>
        </ResetPasswordForm>
      </ResetPasswordContainer>
    );
  }
}

export default ResetPasswordPage;
