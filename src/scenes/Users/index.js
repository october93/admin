import React, { Component } from 'react'
import ReactTable from 'react-table'
import { connect } from 'react-redux'
import moment from 'moment'
import copy from 'copy-to-clipboard'
import { getUsers, getPreviewFeed, getPreviewInviteFeed, blockUser, unblockUser, blacklistUser, removeUserFromBlacklist } from '../../store/actions/users'
import { getConnections } from '../../store/actions/whoisonline'
import { newInvite } from '../../store/actions/invites'
import Link from "../../components/link"
import TruncatedWithCopy from "../../components/truncatedWithCopy"
import glamorous from "glamorous"

import "./tablestyles.css"

const { REACT_APP_APP_HOST } = process.env

const ActionLink = glamorous(Link)({
  fontSize: "12px",
})

const ProfileImage = glamorous.img({
  width: "40px",
  objectFit: "cover",
  height: "40px",
  borderRadius: "100",
  marginRight: "10px",
})

const ProfileName = glamorous.div({
  fontSize: "14px",
  fontWeight: "bold",
})

const Sep = glamorous.div({
  width: "20px",
})

const headerStyle = {
  boxShadow: "none",
  fontSize: "12px",
  border: "none",

  "&:focus": {
    outline: "none",
  },
}

const columnStyle = {
  border: "none",
  fontSize: "12px",
  height: "50px",
  alignItems: "center",
  display: "flex",
  margin: "10px 0px",
}

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
  headerStyle,
  style: columnStyle,
  Header: 'User',
  id: "user",
  accessor: d => d,
  width: 220,
  filterable: true,
  sortable: false,
  filterMethod: (filter, row) => {
    return row[filter.id].username.startsWith(filter.value) || filter.value === row[filter.id].id || row[filter.id].displayName.toLowerCase().startsWith(filter.value.toLowerCase())
  },
  Cell: props =>
  <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
    <ProfileImage src={props.value.profileImagePath} />
    <div>
      <ProfileName>
        {props.value.displayName}
      </ProfileName>
      {props.value.username} (<TruncatedWithCopy id={props.value.id} />)
    </div>
  </div>
}, {
  headerStyle,
  style: columnStyle,
  Header: "Last Active",
  id: "lastActiveAt",
  width: 150,
  accessor: d => ({lastActive: Date.parse(d.lastActiveAt) || 0, online: d.online}),
  sortMethod: (a, b) => {
    if (a.online && b.online) {
      return 0
    }
    if (a.online && !b.online) {
      return 1
    }
    if (!a.online && b.online) {
      return -1
    }
    if (a.lastActive === b.lastActive) {
      return 0
    }

    return a.lastActive > b.lastActive ? 1 : -1
  },
  Cell: props => {
    if (props.value.online) {
      return <span style={{color: "lightgreen"}}>Online</span>
    } else if (props.value.lastActive) {
      return moment(props.value.lastActive).fromNow()
    }
    return "-"
  }
}, {
  headerStyle,
  style: columnStyle,
  Header: "Invited By",
  id: "invitedBy",
  filterable: true,
  width: 200,
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
      headerStyle,
      Header: "",
      id: "actions",
      accessor: d => d,
      minWidth: 350,
      Cell: props => (
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", height: "100%" }}>
          <ActionLink onClick={() => this.viewUserFeedInApp(props.value.username)}>Preview Feed</ActionLink>
          <Sep />
          <ActionLink onClick={() => this.viewUserInviteFeedInApp(props.value.username)}>Preview Invite Feed</ActionLink>
          <Sep />
          <ActionLink onClick={() => this.newInviteForUser(props.value.id)}>Give Invite</ActionLink>
            { !props.value.blacklisted ? (
              <React.Fragment>
                <Sep />
                <ActionLink color="orange" onClick={() => this.props.blacklistUser(props.value.id)}>Blacklist User</ActionLink>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Sep />
                <ActionLink color="green" onClick={() => this.props.removeUserFromBlacklist(props.value.id)}>Unblacklist User</ActionLink>
              </React.Fragment>

            )}
          { !props.value.blocked ? (
            <React.Fragment>
              <Sep />
              <ActionLink color="red" onClick={() => this.props.blockUser(props.value.id)}>Block User</ActionLink>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Sep />
              <ActionLink color="green" onClick={() => this.props.unblockUser(props.value.id)}>Unblock User</ActionLink>
            </React.Fragment>

          )}

        </div>)
    })

    this.cols = cols
  }

  componentDidMount = async() => {
    await this.props.getUsers()
    await this.props.getConnections()
  }

  viewUserFeedInApp = async nodeID => {
    const ids = await this.props.getPreviewFeed(nodeID)
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
         showPagination={this.props.users.length > 100}
         minRows={0}
         defaultPageSize={25}
         style={{
            border: "none",
          }}
         headerStyle={headerStyle}
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
  blockUser,
  unblockUser,
  newInvite,
  getConnections,
  blacklistUser,
  removeUserFromBlacklist,
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersPage)
