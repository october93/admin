import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import { Button, Colors, Sizes, Label } from 'react-foundation';

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
    let statusIndicator = (<Label color={Colors.SECONDARY}>Querying...</Label>)

    if(this.props.store.hnStatus === "up"){
      statusIndicator = (<Label color={Colors.SUCCESS}>Running</Label>)
    } else if (this.props.store.hnStatus === "down"){
      statusIndicator = (<Label color={Colors.ALERT}>Down</Label>)
    }

    return (
      <div>
        <div>
          <div className="importerStatus">
            HN Importer: {statusIndicator}
          </div>
          <div className="importerButtons">
            <Button color={Colors.SUCCESS} size={Sizes.SMALL} onClick={() => this.props.store.changeHNStatusRequest("up")}>Start</Button>
            <Button color={Colors.ALERT} size={Sizes.SMALL} onClick={() => this.props.store.changeHNStatusRequest("down")}>Stop</Button>
          </div>
        </div>

        <div className="separator" />

        <div>
          <b>Command Tester<br /></b>

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
