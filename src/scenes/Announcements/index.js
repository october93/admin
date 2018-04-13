import React, { Component } from 'react'
import { connect } from 'react-redux'
import glamorous from "glamorous"

import Button from '../../components/button'
import TextInput from '../../components/textinput'

import {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} from '../../store/actions/announcements'


import {
  getUsers,
} from '../../store/actions/users'

const Container = glamorous.div({

})

const UserSelectorContainer = glamorous.div({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  width: "400px",
})

const StyledButton = glamorous(Button)(({ active }) => ({
  margin: "5px",
  backgroundColor: active ? "#02A8F3" : "white",
  color: active ? "white" : "black",
  borderColor: active ? "white" : null,
}))


class Announcements extends Component {
  state = {
    selectedUsers: [],
    fromUser: "",
    cardID: "",
    message: "",
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
    let selectedUsers = this.state.selectedUsers

    if (selectedUsers.includes(username)) {
      selectedUsers = selectedUsers.filter(un => un !== username)
    } else {
      selectedUsers.push(username)
    }
    this.setState({ selectedUsers })
  }

  selectAll = username => {
    this.setState({ selectedUsers: this.props.users.map(u => u.username) })
  }

  selectNone = username => {
    this.setState({ selectedUsers: []})
  }

  createAnnouncement = () => {
    const {
      selectedUsers,
      fromUser,
      cardID,
      message,
    } = this.state
    this.props.createAnnouncement({
      selectedUsers,
      fromUser,
      cardID,
      message,
    })
  }

  render() {
    const {
      announcements,
      users
    } = this.props

    const {
      selectedUsers,
    } = this.state
    console.log(announcements, users)

    return (
      <Container>
        Message:
        <TextInput onChange={e => this.setState({message: e.target.value})}/>

        FOR:
        <TextInput onChange={e => this.setState({cardID: e.target.value})}/>
        FROM:
        <select value={this.state.fromUser} onChange={e => this.setState({ fromUser: e.target.value })}>
          {
            users.map(u => <option>{u.username}</option>)
          }
        </select>
        TO:
        <Button onClick={this.selectAll}>
          All
        </Button>
        <Button onClick={this.selectNone}>
          None
        </Button>
        <UserSelectorContainer>
          {
            users.map(u => <StyledButton active={selectedUsers.includes(u.username)} onClick={() => this.toggleSelectUser(u.username)}>{u.username}</StyledButton>)
          }
        </UserSelectorContainer>
        <Button onClick={this.createAnnouncement}>Create</Button>
      </Container>

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
