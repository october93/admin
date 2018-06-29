import React, { Component } from 'react'
import { connect } from 'react-redux'
import glamorous from "glamorous"
import ReactTable from 'react-table'
import moment from 'moment'

import Button from '../../components/button'
import TextInput from '../../components/textinput'
import Select from '../../components/select'
import Checkbox from '../../components/checkbox'

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

const GroupContainer = glamorous.div({
  margin: "7px 0px",
})

const OptionGroup = glamorous.div()

const Label = glamorous.div()

const Spacer = glamorous.div({
  height: "40px",
})

const StyledButton = glamorous(Button)(({ active }) => ({
  backgroundColor: active ? "#02A8F3" : null,
  color: active ? "white" : null,
  border: active? "1px white solid" : null,
  marginRight: "10px",

}))



class Announcements extends Component {
  state = {
    toUsers: [],
    fromUser: "",
    forCard: "",
    message: "",
    sendPush: false,
  }
  componentDidMount() {
    this.props.getAnnouncements()
    this.props.getUsers()
  }

  changeText = (event) => {
    this.setState({ blacklist: event.target.value })
  }

  submitDemo = async () => {
    await this.props.setBlacklist(this.state.blacklist)
    await this.props.getBlacklist()
  }

  removeFromBlacklist = async card => {
    await this.props.removeFromBlacklist(`["${card}"]`)
    await this.props.getBlacklist()
  }

  toggleSelectUser = username => {
    let toUsers = this.state.toUsers

    if (toUsers.includes(username)) {
      toUsers = toUsers.filter(un => un !== username)
    } else {
      toUsers.push(username)
    }
    this.setState({ toUsers })
  }

  selectAll = username => {
    this.setState({ toUsers: this.props.users.map(u => u.username) })
  }

  selectNone = username => {
    this.setState({ toUsers: []})
  }

  deleteAnnouncement = async(id) => {
    await this.props.deleteAnnouncement(id)
    this.props.getAnnouncements()
  }

  createAnnouncement = () => {
    const {
      toUsers,
      fromUser,
      forCard,
      message,
      sendPush,
    } = this.state

    this.props.createAnnouncement({
      toUsers: toUsers.map(n => this.props.users.find(u => u.username === n).nodeId),
      fromUser: this.props.users.find(u => u.username === fromUser).nodeId,
      forCard,
      message,
      sendPush,
    })
  }

  makeCols = () => {
    return [{
      Header: 'Message',
      accessor: 'message',
      filterable: true,
    }, {
      Header: 'From',
      id: 'user.id',
      accessor: d =>(this.props.users.find(u => u.nodeId === d.userID) || {}).username,
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
      users
    } = this.props

    const { toUsers, sendPush } = this.state

    return (
      <div style={{display: "flex", flexDirection: "column", flex: 1 }}>
        <Container>
          <TextInput label="Message" onChange={e => this.setState({message: e.target.value})}/>
          <TextInput label="For"  onChange={e => this.setState({forCard: e.target.value})}/>
          <Select label="From" options={users.map(u => u.username)} value={this.state.fromUser} onChange={e => this.setState({ fromUser: e.target.value })} />
          <GroupContainer>
            <Label>To:</Label>
            <OptionGroup>
              <StyledButton active={toUsers.length > 1} onClick={this.selectAll}>
                All
              </StyledButton>
              OR <Select options={users.map(u => u.username)} value={this.state.toUsers[0]} onChange={e => this.setState({ toUsers: [e.target.value] })} />
            </OptionGroup>
          </GroupContainer>
          <Checkbox checked={sendPush} label="Send Push Notifications" onChange={e => this.setState({ sendPush: e.target.checked })} />
          <Button onClick={this.createAnnouncement}>Create</Button>
        </Container>

        <Spacer />

        <ReactTable
         data={announcements}
         columns={this.makeCols()}
         defaultPageSize={100}
         showPagination={this.props.users.length > 100}
         minRows={0}
        />

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
