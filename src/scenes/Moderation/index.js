import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { InstantSearch } from 'react-instantsearch/dom';
import Textarea from '../../components/textarea'
import Search from '../../components/Search'

@inject("store") @observer
export default class Moderation extends Component {
  constructor(props) {
    super(props)
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
          <InstantSearch
            appId="0Z498T9C13"
            apiKey="b5dcca10ada97954dfc6b4d5b77786a4"
            indexName="local_engine"
            >
            <Search />
          </InstantSearch>
          <form style={{ width: "100%" }} onSubmit={this.submitDemo}>
            <Textarea value={this.props.store.blacklistData} onChange={this.changeText}></Textarea>
            <button type="submit">Blacklist</button>
          </form>
        </div>
        <div>
          <h3>CurrentBlacklist</h3>
          {store.blacklistedCards.map((card, i) => <div key={i}>{card}</div>)}
        </div>
      </div>

    )
  }
}
