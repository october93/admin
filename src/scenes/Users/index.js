import React, { Component } from 'react';
import ReactTable from 'react-table'
import { connect } from 'react-redux'

import { getUsers, getPreviewFeed, getPreviewInviteFeed } from '../../store/actions/users'
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
}]


class UsersPage extends Component {

  constructor(props){
    super(props)

    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      this.appEndpoint = 'http://localhost:3000'
    } else if (location.hostname === "engine.october.news") {
      this.appEndpoint = 'https://web.development.october.news'
    }
  }

  componentDidMount() {
    this.props.getUsers()
  }

  viewUserFeedInApp = async nodeID => {
    const ids = await this.props.getPreviewFeed(nodeID)
    console.log(ids)
    window.open(`${this.appEndpoint}/test-feed?test=${encodeURIComponent(JSON.stringify(ids))}`, "_blank")
  }

  viewUserInviteFeedInApp = async nodeID => {
    const ids = await this.props.getPreviewInviteFeed(nodeID)
    console.log(ids)
    window.open(`${this.appEndpoint}/test-feed?test=${encodeURIComponent(JSON.stringify(ids))}`, "_blank")
  }

  makeButtonColumn = () => {
    return
  }

  render() {
    const cols = [...columns]

    if (this.appEndpoint) {
      cols.push({
        Header: "",
        accessor: "nodeId",
        Cell: props => (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Button onClick={() => this.viewUserFeedInApp(props.value)}>Preview Feed</Button>
            <Button onClick={() => this.viewUserInviteFeedInApp(props.value)}>Preview Feed</Button>
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
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersPage)
