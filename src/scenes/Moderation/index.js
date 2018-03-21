import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import Textarea from "../../components/textarea"


@inject("store") @observer
export default class ConnectPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      users: '[""]',
      password: '',
    }

    this.props.store.getBlacklistedCards()
  }

  changeText = (event) => {
    this.props.store.blacklistData = event.target.value
  }

  submitDemo = (event) => {
    event.preventDefault()

    this.props.store.setBlacklistedRequest(this.props.store.blacklistData)
  }

  render() {
    const store = this.props.store

    return (
      <div style={{ width: "100%" }}>
        <div>
          <h3>Blacklist Cards</h3>
          <form style={{ width: "100%" }} onSubmit={this.submitDemo}>
            <Textarea value={this.props.store.blacklistData} onChange={this.changeText}></Textarea>
            <button type="submit" className="button">Blacklist</button>
          </form>
        </div>
        <div>
          <h3>CurrentBlacklist</h3>
          {store.blacklistedCards.map(card => <div>{card}</div>)}
        </div>
      </div>

    )
  }
}
