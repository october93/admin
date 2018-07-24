import React, { Component } from 'react'
import ReactTable from 'react-table'
import { connect } from 'react-redux'
import moment from 'moment'
import copy from 'copy-to-clipboard'
import { getUsers, getPreviewFeed, getPreviewInviteFeed } from '../../store/actions/users'
import Tooltip from 'rc-tooltip'
import { newInvite } from '../../store/actions/invites'
import Button from "../../components/button"
import Link from "../../components/link"
import glamorous from "glamorous"

import "react-table/react-table.css"

const { REACT_APP_APP_HOST } = process.env

const CoppiedBar = glamorous.div({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: "40px",
  backgroundColor: "green",
  zIndex: 1000,
  color: "white",
  fontWeight: "semibold",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
})

const columns = [{
  Header: 'Username',
  accessor: 'username',
  filterable: true,
  width: 200,
}, {
  Header: 'NodeID',
  accessor: 'id',
  width: 70,
  Cell: props =>
  <Tooltip
    arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
    placement="left"
    overlay={`${props.value}\n(Click to Copy)`}>
    <Link onClick={() => copy(props.value)}>
      {props.value}
    </Link>
  </Tooltip>

}, {
  Header: "CR Size",
  accessor: 'node.cardRankTableSize',
  width: 150,
}, {
  Header: "Last Active",
  id: "updatedAt",
  width: 150,
  accessor: d => Date.parse(d.updatedAt),
  Cell: props => props.value ? moment(props.value).fromNow() : "Never"
}, {
  Header: "Invited By",
  id: "invitedBy",
  filterable: true,
  accessor: d => d.joinedFromInvite ? d.joinedFromInvite.issuer.username : "",
}]


class UsersPage extends Component {
  state = {
    showCoppiedBar: false,
    coppiedInviteCode: "",
  }
  constructor() {
    super()

    const cols = [...columns]

    cols.push({
      Header: "",
      id: "actions",
      accessor: d => d,
      width: 350,
      Cell: props => (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Button onClick={() => this.viewUserFeedInApp(props.value.username)}>Preview Feed</Button>
          <div style={{width: "10px"}} />
          <Button onClick={() => this.viewUserInviteFeedInApp(props.value.username)}>Preview Invite Feed</Button>
          <div style={{width: "10px"}} />
          <Button onClick={() => this.newInviteForUser(props.value.id)}>Get Invite</Button>
        </div>)
    })

    this.cols = cols
  }

  /*
  <div style={{width: "10px"}} />
  <Button onClick={() => this.viewUserInviteFeedInApp(props.value.id)}>Preview Invite</Button>
  */

  componentDidMount() {
    this.props.getUsers()
  }

  viewUserFeedInApp = async nodeID => {
    const ids = await this.props.getPreviewFeed(nodeID)
    console.log(ids)
    window.open(`${REACT_APP_APP_HOST}/test-feed?test=${encodeURIComponent(JSON.stringify(ids))}`, "_blank")
  }

  viewUserInviteFeedInApp = async nodeID => {
    const ids = await this.props.getPreviewInviteFeed(nodeID)
    window.open(`${REACT_APP_APP_HOST}/test-feed?test=${encodeURIComponent(JSON.stringify(ids))}`, "_blank")
  }

  newInviteForUser = async nodeID => {
    const invite = await this.props.newInvite(nodeID)
    this.setState({showCoppiedBar: true, coppiedInviteCode: invite.token })
  }

  copyCodeAndClose = () => {
    copy(this.state.coppiedInviteCode)
    this.setState({ showCoppiedBar: false, coppiedInviteCode: ""})
  }

  render() {
    const { showCoppiedBar, coppiedInviteCode } = this.state

    return (
      <div style={{ width: "100%", margin: "10px"}}>
        {showCoppiedBar &&
          <CoppiedBar onClick={this.copyCodeAndClose}>
            Generated Invite Code: {coppiedInviteCode} (Click To Copy)
          </CoppiedBar>}
        <ReactTable
         data={this.props.users}
         columns={this.cols}
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
