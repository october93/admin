import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import RPCHistoryItem from '../../components/RPCHistoryItem';

import './style.scss'

const defaultRPC = '{"rpc": "", "sessionID": "", "data": {}}'

@inject("store") @observer
export default class UtilitiesPage extends Component {
  constructor(props){
    super(props)

    this.state = {
      commandTextArea: defaultRPC,
      history: JSON.parse(localStorage.getItem("rpcHistory")),
    }

    this.props.store.getSessionsRequest()

    this.inputChange = this.inputChange.bind(this)
    this.submit = this.submit.bind(this)
    this.handleHistoryClick = this.handleHistoryClick.bind(this)
    this.handleHistoryClear = this.handleHistoryClear.bind(this)
    this.handleSessionChange = this.handleSessionChange.bind(this)
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
    this.props.store.sendCommandRequest(this.state.commandTextArea)
  }

  inputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleHistoryClick(content) {
    this.setState({commandTextArea: content})
  }

  handleHistoryClear() {
    localStorage.removeItem('rpcHistory')
    this.setState({history: []})
  }

  handleSessionChange(e) {
    let currentRPC = this.state.commandTextArea
    try {
      currentRPC = JSON.parse(currentRPC)
    } catch(e) {
      currentRPC = JSON.parse(defaultRPC)
    }
    currentRPC["sessionID"] = e.target.value
    this.setState({commandTextArea: JSON.stringify(currentRPC)})
  }

  render() {
    return (
      <div className="pageMargins">
        <div>
          <h4>RPC Tester</h4>
          Response:
          <div className="commandResponse">
            <pre>
              {this.props.store.commandResponse}
            </pre>
          </div>
          <form onSubmit={this.submit}>
            <textarea className="rpcInput" name="commandTextArea" placeholder="Input a command!" value={this.state.commandTextArea} onChange={this.inputChange} />
            <select onChange={this.handleSessionChange}>
              <option value="" disabled selected>Use session of…</option>
              {this.props.store.sessionsData.toJS().map((data) =>
                  <option value={data.id}>{data.username} ({data.id})</option>
              )}
            </select>
            <button type="submit" className="button">Submit</button>
          </form>
          {this.state.history && this.state.history.length > 0 &&
            <div>
              <h4>History</h4>
              <p>Select past RPC to restore input above:</p>
                <ul className="historyList">
                  {this.state.history.map(rpc => <RPCHistoryItem content={rpc} handleClick={this.handleHistoryClick}/>)}
                </ul>
                <a className="button" onClick={this.handleHistoryClear}>Delete History</a>
              </div>
          }
        </div>
      </div>
    )
  }
}
