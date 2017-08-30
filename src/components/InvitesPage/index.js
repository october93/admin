import React, { Component } from 'react';
import { observer, inject  } from 'mobx-react'
import Timestamp from 'react-timestamp'

@inject("store") @observer
class InvitesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {password: ''}
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.props.store.getInvitesRequest()
  }

  handleChange(event) {
    const name = event.target.name;
    this.setState({[name]: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault()
  }

  render() {
    let errorMessage = null;
    if (this.props.store.inviteError !== null) {
      errorMessage = <span className="danger">{this.props.store.inviteError}</span>
    }
    const inviteList = this.props.store.invitesData.toJS().map((data) =>
      <tr>
        <td>{data.token}</td>
        <td>{data.issuer}</td>
        <td><Timestamp time={data.expires} precision={2} /></td>
      </tr>
    )
    return (
      <div className="InvitesPage">
        {errorMessage}
        <table className="inviteTable">
          <thead>
            <tr>
              <th>Token</th>
              <th>Created by</th>
              <th>Expires in</th>
            </tr>
          </thead>
          <tbody>
            {inviteList}
          </tbody>
        </table>
      </div>
    );
  }
}

export default InvitesPage;
