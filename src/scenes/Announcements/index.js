import React, { Component } from 'react'
import { connect } from 'react-redux'
import glamorous from "glamorous"
import ReactTable from 'react-table'
import moment from 'moment'
import qs from "query-string"

import Button from '../../components/button'
import TextInput from '../../components/textinput'
import TextArea from '../../components/textarea'
import Select from '../../components/select'
import Checkbox from '../../components/checkbox'
import TopBar from '../../components/topbar'
import CollapsibleContainer from "../../components/collapsible-container"

import ListSelector from "./list-selector"

import {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} from '../../store/actions/announcements'

import {
  getUsers,
} from '../../store/actions/users'

import "react-table/react-table.css"

const Container = glamorous.div({
  display: "block",
  width: "40%",
})

const Spacer = glamorous.div(({ height = 40 }) => ({
  height,
}))

// URL Param format example
// http://localhost:3200/admin/announcements?fromUser=paul&type=promoteCard&fromDisplayName=Paul%20Bohm&forCard=74830808-ca17-469d-b54a-2bdec56ac7d8&sendPush=true


const messagePresets = ({type, ...params}) => {
  switch (type) {
    case "promoteCard":
      return `**${params.fromDisplayName}** has a new post on October!`
    default:
      return ""
  }
}


class Announcements extends Component {
  state = {
    allUsers: [],
    toUsers: [],
    fromUser: "",
    forCard: "",
    message: "",
    showTopBar: false,
    topBarColor: "green",
    topBarText: "",
    sendPush: false,
  }

  componentDidMount = async() => {
    this.props.getAnnouncements()

    const queryParams = qs.parse(this.props.location.search)
    this.setState({
      fromUser: queryParams.fromUser,
      message: messagePresets(queryParams),
      forCard: queryParams.forCard,
      sendPush: queryParams.sendPush === 'true',
    })

    const allUsers = await this.props.getUsers()
    this.setState({ allUsers })
  }

  addUserToRecipients = userToMove =>
    this.setState({
      allUsers: this.state.allUsers.filter(u => u.id !== userToMove.id),
      toUsers: [...this.state.toUsers, userToMove],
    })

  removeUserFromRecipients = userToMove =>
    this.setState({
      toUsers: this.state.toUsers.filter(u => u.id !== userToMove.id),
      allUsers: [...this.state.allUsers, userToMove],
    })

  addAllUsers = () => this.setState({
    toUsers: this.props.users,
    allUsers: [],
  })

  removeAllUsers = () => this.setState({
    allUsers: this.props.users,
    toUsers: [],
  })

  deleteAnnouncement = async(id) => {
    await this.props.deleteAnnouncement(id)
    this.props.getAnnouncements()
  }

  createAnnouncement = async () => {
    const {
      toUsers,
      fromUser: fromUsername,
      forCard,
      message,
      sendPush,
    } = this.state

    if (!toUsers || toUsers.length <= 0) {
      this.setState({
        showTopBar: true,
        topBarColor: "red",
        topBarText: "Specify at least one user to send to.",
      })
      return
    } else if (!fromUsername || fromUsername.length <= 0) {
      this.setState({
        showTopBar: true,
        topBarColor: "red",
        topBarText: "Specify a user to send the notification from.",
      })
      return
    } else if (!message || message.length <= 0) {
      this.setState({
        showTopBar: true,
        topBarColor: "red",
        topBarText: "You must specify a message",
      })
      return
    }

    const toUserIDs = toUsers.map(u => u.id)
    const fromUser = this.props.users.find(u => u.username === fromUsername)

    const announcement = {
      toUsers: toUserIDs,
      fromUser: fromUser.id,
      message,
      sendPush,
    }

    if (forCard) {
      announcement.forCard = forCard
    }


    const resp = await this.props.createAnnouncement(announcement)

    if (resp.error) {
      this.setState({
        showTopBar: true,
        topBarColor: "red",
        topBarText: resp.error.message,
      })
    } else {
      this.setState({
        showTopBar: true,
        topBarColor: "green",
        topBarText: "Announcement Sent!",
      })
    }
  }


  makeCols = () => {
    return [{
      Header: 'Message',
      accessor: 'message',
      filterable: true,
    }, {
      Header: 'From',
      id: 'user.id',
      accessor: d =>(this.props.users.find(u => u.id === d.userID) || {}).username,
    }, {
      Header: "For Card",
      accessor: 'card.id',
    }, {
      Header: "Announced At",
      accessor: 'createdAt',
      Cell: props => moment(props.value * 1000).fromNow()
    }, {
      Header: "Deleted At",
      accessor: 'deletedAt',
      Cell: props => props.value > 0 ? moment(props.value * 1000).fromNow() : ""
    }, {
      Header: "Delete",
      accessor: 'id',
      Cell: props => <Button onClick={() => this.deleteAnnouncement(props.value)}>Delete</Button>

    }]
  }


  render() {
    const {
      announcements,
      users,
    } = this.props

    const {
      toUsers,
      sendPush,
      fromUser,
      message,
      forCard,
      allUsers,
      showTopBar,
      topBarText,
      topBarColor,
    } = this.state

    return (
      <div style={{display: "flex", flexDirection: "column", flex: 1 }}>
        { showTopBar &&
          <TopBar backgroundColor={topBarColor} onClick={() => this.setState({ showTopBar: false })}>
            {topBarText}
          </TopBar>
        }
        <Container>
          <TextArea label="Message*" onChange={e => this.setState({message: e.target.value})} value={message} />
          <TextInput label="For Card"  onChange={e => this.setState({forCard: e.target.value})} value={forCard}/>
          <Select label="From*" options={users.map(u => u.username)} value={fromUser} onChange={e => this.setState({ fromUser: e.target.value })} />
          <Checkbox checked={sendPush} label="Send Push Notifications" onChange={e => this.setState({ sendPush: e.target.checked })} />
        </Container>
        <ListSelector
          unselectedLabel="Available Recipients"
          selectedLabel="Selected Recipients"
          unselectedItems={allUsers}
          selectedItems={toUsers}
          addToSelected={this.addUserToRecipients}
          removeFromSelected={this.removeUserFromRecipients}
          selectAll={this.addAllUsers}
          removeAll={this.removeAllUsers}
        />
        <Spacer height={20} />

        <Button onClick={this.createAnnouncement}>Create</Button>

        <Spacer height={40} />

        <CollapsibleContainer label="Announcement History">
          <ReactTable
           data={announcements}
           columns={this.makeCols()}
           defaultPageSize={100}
           showPagination={this.props.users.length > 100}
           minRows={0}
          />
        </CollapsibleContainer>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  announcements: state.announcements,
  users: state.users,
})

const mapDispatchToProps = {
  getAnnouncements,
  getUsers,
  createAnnouncement,
  deleteAnnouncement,
}

export default connect(mapStateToProps, mapDispatchToProps)(Announcements)
