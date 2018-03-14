import React, { Component } from 'react';
import { observer, inject  } from 'mobx-react'
import Timestamp from 'react-timestamp'

@inject("store") @observer
class InvitesPage extends Component {
  constructor(props) {
    super(props);
    this.handleNewInvite = this.handleNewInvite.bind(this);
    this.props.store.getInvitesRequest()
  }

  handleNewInvite(event) {
    event.preventDefault()

    var nodeID = prompt("ID for Inviting Node (REQUIRED):")

    if (nodeID) {
      this.props.store.newInviteRequest(nodeID)
    }
  }

  render() {
    let errorMessage = null;
    if (this.props.store.newInviteError !== null) {
      errorMessage = <span className="danger">{this.props.store.inviteError}</span>
    }
    let invitesData = this.props.store.invitesData.toJS()
    console.log(invitesData)
    const inviteList = invitesData.map((data, i) =>
      <tr key={i}>
        <td>{data.token}</td>
        <td>{data.issuer}</td>
        <td><Timestamp time={data.expires} precision={2} /></td>
        <td>{data.remainingUses}</td>
      </tr>
    )
    return (
      <div className="pageMargins">
        {errorMessage}
        <a className="button" onClick={this.handleNewInvite}>New Invite</a>
        <table className="inviteTable">
          <thead>
            <tr>
              <th>Token</th>
              <th>Created by</th>
              <th>Expires in</th>
              <th>Uses Left</th>
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
