import React, { Component } from 'react';
import { observer, inject  } from 'mobx-react'
import Timestamp from 'react-timestamp'
import Button from "../button"
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
    const inviteList = invitesData.map((data, i) =>
      <tr key={i}>
        <td>{data.token}</td>
        <td>{data.issuer}</td>
        <td><Timestamp time={data.expires} precision={2} /></td>
        <td>{data.remainingUses}</td>
      </tr>
    )
    return (
      <div style={{ width: "100%" }}>
        {errorMessage}
        <Button onClick={this.handleNewInvite}>New Invite</Button>
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
