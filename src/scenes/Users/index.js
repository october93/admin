import React, { Component } from 'react'
import ReactTable from 'react-table'
import { connect } from 'react-redux'
import moment from 'moment'
import copy from 'copy-to-clipboard'

import { getUsers, getPreviewFeed, getPreviewInviteFeed } from '../../store/actions/users'
import { newInvite } from '../../store/actions/invites'
import Button from "../../components/button"

import "react-table/react-table.css"


const columns = [{
  Header: 'Username',
  accessor: 'username',
  filterable: true,
}, {
  Header: 'NodeID',
  accessor: 'nodeId',
}, {
  Header: "Scoretable Size",
  accessor: 'node.cardRankTableSize',
}, {
  Header: "Last Active",
  accessor: 'updatedAt',
  Cell: props => props.value ? moment(props.value * 1000).fromNow() : "Never"
}]


class UsersPage extends Component {

  constructor(props){
    super(props)

    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      this.appEndpoint = 'http://localhost:3000'
    } else if (location.hostname === "engine.october.news") {
      this.appEndpoint = 'https://october.news'
    } else if (location.hostname === "engine.development.october.news") {
      this.appEndpoint = 'https://development.october.news'
    }
  }

  componentDidMount() {
    this.props.getUsers()
  }

  viewUserFeedInApp = async nodeID => {
    const ids = await this.props.getPreviewFeed(nodeID)
    window.open(`${this.appEndpoint}/test-feed?test=${encodeURIComponent(JSON.stringify(ids))}`, "_blank")
  }

  viewUserInviteFeedInApp = async nodeID => {
    const ids = await this.props.getPreviewInviteFeed(nodeID)
    window.open(`${this.appEndpoint}/test-feed?test=${encodeURIComponent(JSON.stringify(ids))}`, "_blank")
  }

  newInviteForUser = async nodeID => {
    const invite = await this.props.newInvite(nodeID)
    copy(invite.token)
  }

  render() {
    const cols = [...columns]

    if (this.appEndpoint) {
      cols.push({
        Header: "",
        accessor: "nodeId",
        width: 300,
        Cell: props => (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Button onClick={() => this.viewUserFeedInApp(props.value)}>Preview Feed</Button>
            <div style={{width: "10px"}} />
            <Button onClick={() => this.viewUserInviteFeedInApp(props.value)}>Preview Invite</Button>
            <div style={{width: "10px"}} />
            <Button onClick={() => this.newInviteForUser(props.value)}>Get Invite</Button>
          </div>)
      })
    }

    return (
      <div style={{ width: "100%", margin: "10px"}}>
        <ReactTable
         data={this.props.users}
         columns={cols}
         defaultPageSize={100}
         showPagination={this.props.users.length > 100}
         minRows={0}
        />
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    users: state.users,
    usersLoading: state.usersLoading,
  }
}

const mapDispatchToProps = {
  getUsers,
  getPreviewFeed,
  getPreviewInviteFeed,
  newInvite,
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersPage)
