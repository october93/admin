import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'

import {
  FaHashtag,
  FaEdit,
  FaSave,
  FaTimes,
} from 'react-icons/fa';

import TextInput from "../../components/textinput"
import Button from "../../components/button"
import Checkbox from "../../components/checkbox"

import { getChannels, updateChannel, createChannel } from '../../store/actions/channels'

const NoData = () => <div></div>

class ChannelRow extends Component {
  constructor(props){
    super(props)

    this.state = {
      editing: false,
      newName: props.name,
      newIsDefault: props.isDefault,
      error: "",
    }
  }

  saveUpdate = async() => {
    const error = await this.props.saveUpdate({ name: this.state.newName, isDefault: this.state.newIsDefault})
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
              <FaSave onClick={this.saveUpdate} style={{color: "lightgray"}}/>
              <FaTimes onClick={() => this.setState({ editing: false, error: "", newName: this.props.name, newIsDefault: this.props.isDefault })} style={{color: "lightgray"}} />
              <div style={{ width: "10px" }} />
              <span style={{color: "red"}}>{this.state.error}</span>
            </Fragment>

          ): (
            <Fragment>
              <span>{this.props.name}</span>
              <div style={{ width: "3px" }} />
              { this.props.isDefault ? <span style={{color: "lightgray"}}>(Default)</span> : null }
              <div style={{ width: "10px" }} />
              <FaEdit onClick={()=> this.setState({ editing: true })} style={{color: "lightgray"}} />
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
  }

  makeNewChannel = async() => {
    const error = await this.props.createChannel({ name: this.state.newChannelName, isDefault: this.state.newChannelIsDefault })
    if (error) {
      this.setState({ newChannelError: error.message })
    } else {
      this.setState({ newChannelName: "", newChannelError: "", newChannelIsDefault: false })
    }
  }

  columns = () => [{
      Header: 'Tag',
      id: "tag",
      accessor: v => v,
      Cell: v => (
        <ChannelRow saveUpdate={newChan => this.props.updateChannel({id: v.value.id, ...newChan})} {...v.value}/>
      ),
      Footer: () => (
        <div style={{height: "40px", display: "flex", alignItems: "center"}}>
          <FaHashtag style={{margin: "0px 8px"}}/>
          <TextInput placeholder="Add a Channel" style={{ height: "30px"}} value={this.state.newChannelName} onChange={e => this.setState({newChannelName: e.target.value})}/>
          <div style={{ width: "10px" }} />
          <Checkbox label="Default" checked={this.state.newChannelIsDefault} onChange={e => this.setState({newChannelIsDefault: e.target.checked})}/>
          <div style={{ width: "10px" }} />
          <Button onClick={this.makeNewChannel}>Create</Button>
          <div style={{ width: "10px" }} />
          <span style={{color: "red"}}>{this.state.newChannelError}</span>
        </div>
      )
    },
  ]


  render() {
    const { channels } = this.props
    return (
      <div style={{ width: "100%"}}>
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
  })

const mapDispatchToProps = {
  getChannels,
  updateChannel,
  createChannel,
}


export default connect(mapStateToProps, mapDispatchToProps)(FeatureSwitches)
