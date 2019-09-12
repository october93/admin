import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import copy from 'copy-to-clipboard'

import {
  FaHashtag,
  FaEdit,
  FaSave,
  FaTimes,
} from 'react-icons/fa';

import TextInput from "../../components/textinput"
import Button from "../../components/button"
import Checkbox from "../../components/checkbox"
import TopBar from "../../components/topbar"
import TruncatedWithCopy from "../../components/truncatedWithCopy"


import { getChannels, updateChannel, createChannel, getChannelInvite } from '../../store/actions/channels'

const NoData = () => <div></div>

const { REACT_APP_APP_HOST } = process.env


class ChannelRow extends Component {
  constructor(props){
    super(props)

    this.state = {
      editing: false,
      newName: props.name,
      newIsDefault: props.isDefault,
      newIsPrivate: props.isPrivate,
      error: "",
    }
  }

  saveUpdate = async() => {
    const error = await this.props.saveUpdate({ name: this.state.newName, isDefault: this.state.newIsDefault, isPrivate: this.state.newIsPrivate })
    if (error) {
      this.setState({ error: error.message })
    } else {
      this.setState({ editing: false, error: "" })
    }

  }

  render() {
      return (
        <div style={{height: "30px", display: "flex", alignItems:"center"}}>
          <FaHashtag style={{margin: "0px 8px"}}/>
          { this.state.editing ? (
            <Fragment>
              <TextInput value={this.state.newName} onChange={e => this.setState({ newName: e.target.value })} />
              <div style={{ width: "10px" }} />
              <Checkbox  label="Default" checked={this.state.newIsDefault} onChange={e => this.setState({ newIsDefault: e.target.checked })} />
              <div style={{ width: "10px" }} />
              <Checkbox  label="Private" checked={this.state.newIsPrivate} onChange={e => this.setState({ newIsPrivate: e.target.checked })} />
              <div style={{ width: "10px" }} />
              <FaSave onClick={this.saveUpdate} style={{color: "lightgray"}}/>
              <FaTimes onClick={() => this.setState({ editing: false, error: "", newName: this.props.name, newIsDefault: this.props.isDefault, newIsPrivate: this.props.isPrivate })} style={{color: "lightgray"}} />
              <div style={{ width: "10px" }} />
              <span style={{color: "red"}}>{this.state.error}</span>
            </Fragment>

          ): (
            <Fragment>
              <span>{this.props.name}</span>
                <div style={{ width: "3px" }} />

              (<TruncatedWithCopy id={this.props.id} />)
              <div style={{ width: "3px" }} />

              <div style={{ width: "3px" }} />
              { this.props.isDefault ? <span style={{color: "lightgray"}}>(Default)</span> : null }
              <div style={{ width: "3px" }} />
              { this.props.isPrivate ? <span style={{color: "lightgray"}}>(Private)</span> : null }
              <div style={{ width: "10px" }} />
              <FaEdit onClick={()=> this.setState({ editing: true })} style={{color: "lightgray"}} />
              <div style={{ width: "10px" }} />
              <div style={{color: "#02A8F3", fontSize: "12px"}}onClick={() => this.props.getInvite()}>
                Get Invite
              </div>
            </Fragment>
          )}

        </div>
      )
  }
}

class FeatureSwitches extends Component {
  componentDidMount() {
    this.props.getChannels()
  }

  state = {
    newChannelName: "",
    newChannelsError: "",
    newChannelIsDefault: false,
    newChannelIsPrivate: false,
    showTopBar: false,
    topbarInviteCode: "",
  }

  makeNewChannel = async() => {
    const { newChannelName, newChannelIsDefault, newChannelIsPrivate } = this.state
    const error = await this.props.createChannel({ name: newChannelName, isDefault: newChannelIsDefault, isPrivate: newChannelIsPrivate })
    if (error) {
      this.setState({ newChannelError: error.message })
    } else {
      this.setState({ newChannelName: "", newChannelError: "", newChannelIsDefault: false, newChannelIsPrivate: false })
    }
  }

  getChannelInvite = async(props) => {
    const topbarInviteCode = await this.props.getChannelInvite(props)
    this.setState({ showTopBar: true, topbarInviteCode})
  }

  copyCodeAndClose = () => {
    copy(`${REACT_APP_APP_HOST}/qr/${this.state.topbarInviteCode}`)
    this.setState({ showTopBar: false, topbarInviteCode: ""})
  }

  columns = () => [{
      Header: 'Tag',
      id: "tag",
      minWidth: 400,
      accessor: v => v,
      Cell: v => (
        <ChannelRow saveUpdate={newChan => this.props.updateChannel({id: v.value.id, ...newChan})} getInvite={() => this.getChannelInvite({ channelID: v.value.id, inviterID: this.props.loggedInUserID })} {...v.value}/>
      ),
      Footer: () => (
        <div style={{height: "40px", display: "flex", alignItems: "center"}}>
          <FaHashtag style={{margin: "0px 8px"}}/>
          <TextInput placeholder="Add a Channel" style={{ height: "30px"}} value={this.state.newChannelName} onChange={e => this.setState({newChannelName: e.target.value})}/>
          <div style={{ width: "10px" }} />
          <Checkbox label="Default" checked={this.state.newChannelIsDefault} onChange={e => this.setState({newChannelIsDefault: e.target.checked})}/>
          <div style={{ width: "10px" }} />
          <Checkbox label="Private" checked={this.state.newChannelIsPrivate} onChange={e => this.setState({newChannelIsPrivate: e.target.checked})}/>
          <div style={{ width: "10px" }} />
          <Button onClick={this.makeNewChannel}>Create</Button>
          <div style={{ width: "10px" }} />
          <span style={{color: "red"}}>{this.state.newChannelError}</span>
        </div>
      )
    },{
      Header: 'Posts',
      sortable: true,
      accessor: 'totalPosts',
      width: 100,
    },{
      Header: 'Comments',
      sortable: true,
      accessor: 'totalComments',
      width: 100,
    },{
      Header: 'Unique Commenters',
      sortable: true,
      accessor: 'totalCommenters',
      width: 100,
    },{
      Header: 'Likes',
      sortable: true,
      accessor: 'totalLikes',
      width: 100,
    },{
      Header: 'Dislikes',
      sortable: true,
      accessor: 'totalDislikes',
      width: 100,
    },
  ]


  render() {
    const { channels } = this.props
    const { showTopBar, topbarInviteCode } = this.state
    return (
      <div style={{ width: "100%"}}>
        { showTopBar &&
          <TopBar onClick={this.copyCodeAndClose}>
            {`Generated Code ${topbarInviteCode}! (click to copy)`}
          </TopBar>
        }
        <ReactTable
         data={channels}
         columns={this.columns()}
         defaultPageSize={20}
         minRows={0}
         NoDataComponent={NoData}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
    channels: state.channels,
    loggedInUserID: state.loggedInUserID,
  })

const mapDispatchToProps = {
  getChannels,
  updateChannel,
  createChannel,
  getChannelInvite,
}


export default connect(mapStateToProps, mapDispatchToProps)(FeatureSwitches)
