import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import RPCHistoryItem from '../../components/RPCHistoryItem';

import './style.scss'

@inject("store") @observer
export default class UtilitiesPage extends Component {
  constructor(props){
    super(props)

    this.state = {
      commandTextArea: '{"rpc": "", "sessionID": "", "data": {}}',
      history: JSON.parse(localStorage.getItem("rpcHistory")),
    }

    this.inputChange = this.inputChange.bind(this)
    this.submit = this.submit.bind(this)
    this.handleHistoryClick = this.handleHistoryClick.bind(this)
    this.handleHistoryClear = this.handleHistoryClear.bind(this)
  }

  submit(event){
    event.preventDefault()
    let currentHistory = JSON.parse(localStorage.getItem('rpcHistory'))
    if (currentHistory === null) {
      currentHistory = []
    }
    currentHistory.push(this.state.commandTextArea)
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

  render() {
    return (
      <div>
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
            <button type="submit" className="button">Submit</button>
          </form>
          {this.state.history && this.state.history.length > 0 &&
            <div>
              <h4>History</h4>
              <p>Select item to restore input</p>
                <a className="button" onClick={this.handleHistoryClear}>Clear</a>
                <ul className="historyList">
                  {this.state.history.map(rpc => <RPCHistoryItem content={rpc} handleClick={this.handleHistoryClick}/>)}
                </ul>
              </div>
          }
        </div>
      </div>
    )
  }
}
