import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import './style.scss'

@inject("store") @observer
export default class UtilitiesPage extends Component {
  constructor(props){
    super(props)

    this.state = {
      commandTextArea: '{"rpc": "", "sessionID": "", "data": {}}',
    }

    this.inputChange = this.inputChange.bind(this)
    this.submit = this.submit.bind(this)
  }

  submit(event){
    event.preventDefault()
    console.log("submitpressed")
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

  render() {
    return (
      <div>
        <div>
          <strong>Command Tester<br/></strong>
          Response:
          <div className="commandResponse">
            <pre>
              {this.props.store.commandResponse}
            </pre>
          </div>
          <form onSubmit={this.submit}>
            <textarea name="commandTextArea" placeholder="Input a command!" value={this.state.commandTextArea} onChange={this.inputChange} />
            <button type="submit" className="button">Submit</button>
          </form>
        </div>
      </div>
    )
  }
}
