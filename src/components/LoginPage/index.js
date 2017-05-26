import { Component } from 'react'
import { observer, inject } from 'mobx-react';

@inject("auth") @observer
export default class LoginPage extends Component {
  constructor(props) {
    super(props)
    this.props.auth.login()
  }
}
