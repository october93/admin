import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { FaSpinner }  from 'react-icons/lib/fa';

import {Callout, Colors, Sizes } from 'react-foundation';


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
      <div className="pageMargins">
        <div>
          <h3>Blacklist Cards</h3>
          <form onSubmit={this.submitDemo}>
            <textarea value={this.props.store.blacklistData} onChange={this.changeText}></textarea>
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
