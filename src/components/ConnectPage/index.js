import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';


@inject("store") @observer
export default class ConnectPage extends Component {
  state = {
    password: '',
  }

  handleChange = (event) => {
    const name = event.target.name;
    this.setState({[name]: event.target.value});
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.store.updateSettings(this.state.password)
  }

  render() {
    let errorMessage = null;
    if (this.props.store.updateSettingsError !== null) {
      errorMessage = <span className="danger">{this.props.store.updateSettingsError}</span>
    }

    return (
      <div className="pageMargins">
        <div className="SettingsPage">
          <h3>Change Password</h3>
          {errorMessage}
          <form action="/" onSubmit={this.handleSubmit}>
            <input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.handleChange} />
            <button type="submit" className="button">Update</button>
          </form>
        </div>
      </div>

    )
  }
}
