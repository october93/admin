import React, { Component, PropTypes as T } from 'react'
import { observer, inject } from 'mobx-react';
import { Button } from 'react-foundation';
import AuthService from '../../utils/AuthService'

@inject("auth") @observer
export default class LoginPage extends Component {
  static propTypes = {
    location: T.object,
    auth: T.instanceOf(AuthService)
  }

  render() {
    const auth = this.props.auth
    return (
      <div>
        <h2>Login</h2>
        <Button onClick={auth.login.bind(this)}>Login</Button>
      </div>
    )
  }
}
