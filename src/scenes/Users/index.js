import React, { Component } from 'react'
import ReactTable from 'react-table'
import { connect } from 'react-redux'
import moment from 'moment'
import copy from 'copy-to-clipboard'
import glamorous from "glamorous"

import {
  FaAngleUp,
  FaAngleDoubleUp,
  FaAngleDown,
  FaAngleDoubleDown,
} from 'react-icons/fa';

import {
  getUsers,
  blockUser,
  unblockUser,
  shadowbanUser,
  unshadowbanUser,
  setUserDefaultStatus,
  updateCoinBalance,
  previewUserFeed,
  getUserPool,
} from '../../store/actions/users'

import { getConnections } from '../../store/actions/whoisonline'
import { newInvite } from '../../store/actions/invites'
import Link from "../../components/link"
import Checkbox from "../../components/checkbox"
import TruncatedWithCopy from "../../components/truncatedWithCopy"

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

const coinColor = "#FFC303"

const Coins = glamorous.div({
  color: coinColor,
  textAlign: "center",
  width: "30px",
  margin: "0px 3px",
})


const BalanceContainer = glamorous.div({
  display: "flex",
  flexDirection: "row",
})
/*
const Coins = glamorous.div({

})
const Coins = glamorous.div({

})
const Coins = glamorous.div({

})
*/
const buttonStyle = {
  color: "#c1c1c1",
  cursor: "pointer",
}

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
  accessor: d => ({lastActive: Date.parse(d.lastActiveAt && d.lastActiveAt.time) || 0, online: d.online}),
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
    cols.unshift({
      headerStyle,
      Header: "Is Default",
      id: "isdefault",
      accessor: d => d,
      width: 50,
      sortable: true,
      sortMethod: (a, b) => {
        if (a.isDefault && !b.isDefault) {
          return 1
        }
        if (!a.isDefault && b.isDefault) {
          return -1
        }
        return 0
      },
      Cell: props => (
        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
          <Checkbox
            checked={props.value.isDefault}
            onChange={e => {
              this.props.setUserDefaultStatus(props.value.id, !props.value.isDefault)
            }} />
        </div>

      )
    })
    cols.splice(2, 0, {
      headerStyle,
      Header: "",
      id: "actions",
      accessor: d => d,
      minWidth: 50,
      Cell: props => (
        <div style={{ display: "flex", flexDirection: "column", justifyContent:"space-between", alignItems: "center", height: "100%" }}>
          <BalanceContainer>
            <FaAngleDoubleDown style={buttonStyle} onClick={() => this.props.updateCoinBalance({ userID: props.value.id, coins: -10, tempCoins: 0 })} />
            <FaAngleDown style={buttonStyle} onClick={() => this.props.updateCoinBalance({ userID: props.value.id, coins: -1, tempCoins: 0 })} />
            <Coins>{props.value.coinBalance}</Coins>
            <FaAngleUp style={buttonStyle} onClick={() => this.props.updateCoinBalance({ userID: props.value.id, coins: 1, tempCoins: 0 })} />
            <FaAngleDoubleUp style={buttonStyle} onClick={() => this.props.updateCoinBalance({ userID: props.value.id, coins: 10, tempCoins: 0 })} />
          </BalanceContainer>
        </div>)
    })

    cols.push({
      headerStyle,
      Header: "",
      id: "actions",
      accessor: d => d,
      minWidth: 150,
      Cell: props => (
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", height: "100%" }}>
          <ActionLink onClick={() => this.viewUserFeedInApp(props.value.id)}>Preview Feed</ActionLink>
            <Sep />
            <ActionLink onClick={() => this.viewUserPoolInApp(props.value.id)}>See Card Pool Data</ActionLink>
            { !props.value.shadowbanned ? (
              <React.Fragment>
                <Sep />
                <ActionLink color="orange" onClick={() => this.props.shadowbanUser(props.value.id)}>Shadowban User</ActionLink>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Sep />
                <ActionLink color="green" onClick={() => this.props.unshadowbanUser(props.value.id)}>Unshadowban User</ActionLink>
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

  viewUserFeedInApp = async nodeID => {
    const ids = await this.props.previewUserFeed(nodeID)
    window.open(`${REACT_APP_APP_HOST}/test-feed?test=${encodeURIComponent(JSON.stringify(ids.map(id => ({ id }))))}`, "_blank")
  }

  viewUserPoolInApp = async nodeID => {
    const ids = await this.props.getUserPool(nodeID)
    const stringIDs = JSON.stringify(ids)

    if (ids.length > 20) {
      const data = await fetch('https://file.io/', {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `text=${stringIDs}`
      })
      const json = await data.json()

      if (json.success && json.key) {
        window.open(`${REACT_APP_APP_HOST}/test-feed?uploadkey=${json.key}`, "_blank")
      }
    } else {
      window.open(`${REACT_APP_APP_HOST}/test-feed?test=${encodeURIComponent(stringIDs)}`, "_blank")
    }

  }

  componentDidMount = async() => {
    await this.props.getUsers()
    await this.props.getConnections()
  }

  newInviteForUser = async nodeID => {
    const invite = await this.props.newInvite(nodeID)
    this.setState({showCoppiedBar: true, coppiedInviteCode: invite.token })
  }

  copyCodeAndClose = () => {
    copy(`${REACT_APP_APP_HOST}/qr/${this.state.coppiedInviteCode}`)
    this.setState({ showCoppiedBar: false, coppiedInviteCode: ""})
  }

  render() {
    const { showCoppiedBar, coppiedInviteCode } = this.state
    return (
      <div style={{ width: "100%", margin: "10px"}}>
        {showCoppiedBar &&
          <CoppiedBar onClick={this.copyCodeAndClose}>
            Generated Invite Code: {coppiedInviteCode} (Click To Copy Invite URL)
          </CoppiedBar>}
        <ReactTable
         data={this.props.users}
         columns={this.cols}
         showPagination={this.props.users.length > 25}
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
  setUserDefaultStatus,
  getUsers,
  blockUser,
  unblockUser,
  newInvite,
  getConnections,
  shadowbanUser,
  unshadowbanUser,
  updateCoinBalance,
  previewUserFeed,
  getUserPool,
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersPage)
