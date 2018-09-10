import React, { Component } from 'react';
import ReactTable from 'react-table'
import { connect } from 'react-redux'

import { getInvites, newInvite, bulkCreateInvites, deactivateInvite } from '../../store/actions/invites'
import { getUsers } from '../../store/actions/users'
import Checkbox from "../../components/checkbox"
import Button from "../../components/button"


class InvitesPage extends Component {
  componentDidMount() {
    this.props.getInvites()
    // this.props.getUsers()
  }

  columns = [{
    Header: "",
    width: 30,
    accessor: d => d,
    id: "remove",
    Cell: props => props.value.remainingUses > 0 ? <Button onClick={() => {this.removeInvite(props.value.id)}}>X</Button> : ""
  },{
    Header: 'Token',
    accessor: 'token',
    filterable: true,
  }, {
    Header: 'For User',
    accessor: 'issuer.username',
    filterable: true,
  }, {
    Header: 'Gives Invites',
    id: 'givesInvites',
    width: 100,
    accessor: d => d.givesInvites ? "Yes" : ""
  }, {
    Header: 'In Group',
    id: 'groupedWith',
    accessor: d => d.groupID ? this.props.invitesByGroupID[d.groupID].join(", ") : ""
  }]

  state = {
    bulkInvites: [],
    showUsed: false,
    showPaper: false,
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

  removeInvite = (id) => {
    this.props.deactivateInvite(id)
  }

  getFilteredInvites = () => {
    const { showUsed, showPaper } = this.state
    return this.props.invites
      .filter(v => showUsed || v.remainingUses > 0)
      .filter(v => showPaper || !v.hideFromUser)
  }

  render() {
    const { showUsed, showPaper } = this.state
    return (
      <div style={{ width: "100%" }}>
        <Checkbox checked={showUsed} label="Show Used Invites" onChange={e => this.setState({ showUsed: e.target.checked })} />
        <Checkbox checked={showPaper} label="Show Paper Card Invites" onChange={e => this.setState({ showPaper: e.target.checked })} />

        <div style={{ width: "100%", margin: "10px"}}>
          <ReactTable
           data={this.getFilteredInvites()}
           columns={this.columns}
           defaultPageSize={50}
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
  invitesByGroupID: state.invitesByGroupID,
  inviteesByInviter: state.inviteesByInviter,
})

const mapDispatchToProps = {
  getInvites,
  newInvite,
  bulkCreateInvites,
  deactivateInvite,
  getUsers,
}

export default connect(mapStateToProps, mapDispatchToProps)(InvitesPage)
