import React, { Component } from 'react';
import Timestamp from 'react-timestamp'
import Button from "../../components/button"
import { connect } from 'react-redux'

import { getInvites, newInvite } from '../../store/actions/invites'

class InvitesPage extends Component {
  componentDidMount() {
    this.props.getInvites()
  }

  handleNewInvite = async (event) => {
    event.preventDefault()

    var nodeID = prompt("ID for Inviting Node (REQUIRED):")

    if (nodeID) {
      await this.props.newInvite(nodeID)
      await this.props.getInvites()
    }
  }

  render() {
    const inviteList = this.props.invites.map((data, i) =>
      <tr key={i}>
        <td>{data.token}</td>
        <td>{data.issuer}</td>
        <td><Timestamp time={data.expires} precision={2} /></td>
        <td>{data.remainingUses}</td>
      </tr>
    )
    return (
      <div style={{ width: "100%" }}>
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

const mapStateToProps = (state) => ({
  invites: state.invites,
})

const mapDispatchToProps = {
  getInvites,
  newInvite,
}

export default connect(mapStateToProps, mapDispatchToProps)(InvitesPage)
