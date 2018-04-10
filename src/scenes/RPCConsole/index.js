import React, { Component } from 'react'
import { connect } from 'react-redux'
import Highlight from 'react-highlight'
import RPCHistoryItem from './rpc-history-item'

import Button from '../../components/button'
import Textarea from "../../components/textarea"
import glamorous from "glamorous"

import "../../../node_modules/highlight.js/styles/vs.css"

import APIClient from '../../store/SocketClient'
import { getSessions, sendCommandRequest } from '../../store/actions/rpcconsole'
import { websocketEndpoint } from '../../endpoint'

const CommandResponse = glamorous(Highlight)({
  whiteSpace: "pre-wrap",
  fontSize: "11px",
  fontFamily: "monospace",
})

const defaultRPC = '{"rpc": "", "data": {}}'

class UtilitiesPage extends Component {
  constructor(props){
    super(props)

    this.state = {
			consoleDisabled: true,
      commandTextArea: defaultRPC,
      history: JSON.parse(localStorage.getItem("rpcHistory")),
    }

    this.props.getSessions()

    this.inputChange = this.inputChange.bind(this)
    this.submit = this.submit.bind(this)
    this.handleHistoryClick = this.handleHistoryClick.bind(this)
    this.handleHistoryClear = this.handleHistoryClear.bind(this)
    this.handleSessionChange = this.handleSessionChange.bind(this)
		this.handleConnect = this.handleConnect.bind(this)
  }

  submit(event){
    event.preventDefault()
    let currentHistory = JSON.parse(localStorage.getItem('rpcHistory'))
    if (currentHistory === null) {
      currentHistory = []
    }
    currentHistory.unshift(this.state.commandTextArea)
    localStorage.setItem("rpcHistory", JSON.stringify(currentHistory))
    this.setState({history: currentHistory})
    this.props.sendCommandRequest(this.state.commandTextArea)
  }

  inputChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  handleHistoryClick(content) {
    this.setState({commandTextArea: content})
  }

  handleHistoryClear() {
    localStorage.removeItem('rpcHistory')
    this.setState({history: []})
  }

  handleSessionChange(e) {
		APIClient.init({
			webSocketHost: websocketEndpoint(e.target.value),
			onServerReady: () => this.setState({consoleDisabled: false})
		})
    let currentRPC = this.state.commandTextArea
    try {
      currentRPC = JSON.parse(currentRPC)
    } catch(e) {
      currentRPC = JSON.parse(defaultRPC)
    }
    this.setState({commandTextArea: JSON.stringify(currentRPC)})
  }

	handleConnect(e) {
		e.preventDefault()
		APIClient.init({
			webSocketHost: websocketEndpoint(),
			onServerReady: () => this.setState({consoleDisabled: false})
		})
	}

  render() {
    const { commandResponses } = this.props
    return (
      <div style={{ width: "100%" }}>
        <div>
          <h4>RPC Tester</h4>
          Response:
          { commandResponses.length > 0 &&
            <CommandResponse>
                {commandResponses[commandResponses.length-1].string}
            </CommandResponse>
          }


          <form onSubmit={this.submit}>
						<Textarea style={{ fontFamily: "monospace" }} name="commandTextArea" placeholder="Input a command!" value={this.state.commandTextArea} onChange={this.inputChange} disabled={this.state.consoleDisabled} />
						<Button onClick={this.handleConnect}>Connect Unauthenticated</Button> or <select onChange={this.handleSessionChange}>
              <option value="" disabled selected>Use session of…</option>
              {this.props.sessions.map((data) =>
                  <option value={data.id}>{data.user.username} ({data.id})</option>
              )}
            </select>
            <Button type="submit">Submit</Button>
          </form>
          {this.state.history && this.state.history.length > 0 &&
            <div>
              <h4>History</h4>
              <p>Select past RPC to restore input above:</p>
                <Button onClick={this.handleHistoryClear}>Delete History</Button>
                <ul>
                  {this.state.history.map(rpc => <RPCHistoryItem content={rpc} handleClick={this.handleHistoryClick}/>)}
                </ul>
              </div>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  sessions: state.sessions,
  commandResponses: state.commandResponses,
})

const mapDispatchToProps = {
  getSessions,
  sendCommandRequest,
}

export default connect(mapStateToProps, mapDispatchToProps)(UtilitiesPage)
