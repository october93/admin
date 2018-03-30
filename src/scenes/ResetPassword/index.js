import React, { Component } from 'react';
import { connect } from 'react-redux'
import glamorous from "glamorous"

import { resetPassword } from '../../store/actions/rpcconsole'

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

const Input = glamorous.input({
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

class ResetPasswordPage extends Component {
  state = {
    username: "",
  }
  handleChange = (event) => {
    const name = event.target.name;
    this.setState({[name]: event.target.value});
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.resetPassword([this.state.username])
  }

  render() {
    return (
      <ResetPasswordContainer>
        <ResetPasswordForm>
          <form action="/" onSubmit={this.handleSubmit}>
            <Input type="text" name="email" placeholder="Email" value={this.state.email} onChange={this.handleChange} />
            <Submit type="submit" value="Reset Password" />
          </form>
        </ResetPasswordForm>
      </ResetPasswordContainer>
    );
  }
}

const mapDispatchToProps = {
  resetPassword,
}

export default connect(state => ({}), mapDispatchToProps)(ResetPasswordPage)
