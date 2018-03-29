import React, { Component } from 'react';
import { Link } from 'react-router'
import logo from './logo.png';
import glamorous from "glamorous"
import Error from "../error"
import { connect } from 'react-redux'

import { login } from '../../store/actions/login'

const LoginPageContainer = glamorous.div({
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
})

const LoginForm = glamorous.div({
  marginBottom: "20em",
})

const Logo = glamorous.img({
  width: "250px",
  marginBottom: "2em",
})

const ResetPasswordLink = glamorous(Link)({
  display: "block",
  textAlign: "center",
  marginBottom: "1rem",
})

const Password = glamorous.input({
  marginBottom: "1.5em",
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

class LoginPage extends Component {
  state = {
    username: "",
    password: "",
  }

  handleChange = (event) => {
    const name = event.target.name;
    this.setState({[name]: event.target.value});
  }

  handleSubmit = event => {
    event.preventDefault()
    this.props.login({username: this.state.username, password: this.state.password})
  }

  render() {
    let errorMessage = null;
    if (this.props.loginError !== "") {
      errorMessage = <Error>Not authorized</Error>
    }
    return (
      <LoginPageContainer>
        <LoginForm>
          <Logo role="presentation" src={logo} />
          {errorMessage}
          <form action="/" onSubmit={this.handleSubmit}>
            <input type="text" placeholder="username" name="username" value={this.state.username} onChange={this.handleChange} />
            <Password type="password" name="password" placeholder="password" value={this.state.password} onChange={this.handleChange} />
            <ResetPasswordLink to={"/admin/resetpassword"}>Forgot your password?</ResetPasswordLink>
            <Submit type="submit" value="Sign in" />
          </form>
        </LoginForm>
      </LoginPageContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  loginError: state.loginError,
})

const mapDispatchToProps = {
  login,
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
