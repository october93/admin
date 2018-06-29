import React, { Component } from 'react';
import Button from "../../components/button"
import ReactTable from 'react-table'
import { connect } from 'react-redux'

import { getInvites, newInvite, bulkCreateInvites } from '../../store/actions/invites'

const columns = [{
  Header: 'Token',
  accessor: 'token',
}, {
  Header: 'Created By',
  accessor: 'issuer',
}, {
  Header: "Uses Left",
  accessor: 'remainingUses',
},{
  Header: "Valid",
  id: 'valid',
  accessor: d => d.remainingUses > 0 ? "y" : "n",
  filterable: true,
}]


class InvitesPage extends Component {
  componentDidMount() {
    this.props.getInvites()
  }

  state = {
    bulkInvites: [],
  }

  handleNewInvite = async (event) => {
    event.preventDefault()

    var nodeID = prompt("ID for Inviting Node (REQUIRED):")

    if (nodeID) {
      await this.props.newInvite(nodeID)
      await this.props.getInvites()
    }
  }

  handleBulkInvites = async (event) => {
    event.preventDefault()

    var nodeID = prompt("ID for Inviting Node (REQUIRED):")
    var count = prompt("How many? (Be careful this is permanent):")

    if (nodeID && count) {
      const bulkInvites = await this.props.bulkCreateInvites({nodeID, count})
      await this.props.getInvites()
      this.setState({ bulkInvites })
    }
  }

  render() {
    return (
      <div style={{ width: "100%" }}>
        <Button onClick={this.handleNewInvite}>New Invite</Button>
        <Button onClick={this.handleBulkInvites}>{"Bulk Invites (DANGER)"}</Button>
        <div style={{ width: "100%", margin: "10px"}}>
          <ReactTable
           data={this.props.invites}
           columns={columns}
           defaultPageSize={50}
           defaultFiltered={[{id: "valid", value: "y"}]}
           minRows={0}
          />
        </div>

        { this.state.bulkInvites.length > 0 && <div>{JSON.stringify(this.state.bulkInvites)}</div>}
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
  bulkCreateInvites,
}

export default connect(mapStateToProps, mapDispatchToProps)(InvitesPage)
