import React, { Component } from 'react';
import { Link } from 'react-router'
import { observer, inject  } from 'mobx-react'
import logo from './logo.png';
import glamorous from "glamorous"
import Error from "../error"

const LoginPageContainer = glamorous.div({
  height: "80%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
})

const LoginForm = glamorous.div({
})

const Logo = glamorous.img({
  width: "450px",
  marginBottom: "2em",
})

const ResetPasswordLink = glamorous(Link)({
  display: "block",
  textAlign: "center",
  marginBottom: "1rem",
  marginTop: "2rem",
  color: "#262626",
  textDecoration: "none",

  "&:visited": {
    color: "#262626",
  },
})

const LoginInput = glamorous.input({
  margin: "0 auto 1rem auto",
  padding: "5px",
  height: "30px",
  width: "15rem",
  display: "block",
  fontFamily: "inherit",
  borderRadius: "3px",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "rgb(206, 208, 212)",
  borderImage: "initial",
  outline: "none",
})

const Submit = glamorous.input({
  cursor: "pointer",
  border: "none",
  width: "10em",
  color: "#fff",
  borderRadius: "5px",
  display: "block",
  fontSize: "15px",
  fontWeight: "bold",
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
      errorMessage = <Error>Not authorized</Error>
    }
    return (
      <LoginPageContainer>
        <LoginForm>
          <Logo role="presentation" src={logo} />
          {errorMessage}
          <form action="/" onSubmit={this.handleSubmit}>
            <LoginInput type="text" name="email" placeholder="Username or Email" value={this.state.email} onChange={this.handleChange} />
            <LoginInput type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.handleChange} />
            <ResetPasswordLink to={"/admin/resetpassword"}>Forgot your password?</ResetPasswordLink>
            <Submit type="submit" value="Sign in" />
          </form>
        </LoginForm>
      </LoginPageContainer>
    );
  }
}

export default LoginPage;
