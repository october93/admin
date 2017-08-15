import React, { Component } from 'react';
import { observer, inject  } from 'mobx-react'

@inject("store") @observer
class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {password: ''}
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const name = event.target.name;
    this.setState({[name]: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.store.updateSettings(this.state.password)
  }

  render() {
    let errorMessage = null;
    if (this.props.store.updateSettingsError !== null) {
      errorMessage = <span className="danger">{this.props.store.updateSettingsError}</span>
    }
    return (
      <div className="SettingsPage">
        {errorMessage}
        <form action="/" onSubmit={this.handleSubmit}>
          <input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.handleChange} />
          <input type="submit" value="Update" />
        </form>
      </div>
    );
  }
}

export default SettingsPage;
