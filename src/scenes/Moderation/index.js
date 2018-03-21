import React, { Component } from 'react'
import { InstantSearch } from 'react-instantsearch/dom';
import { connect } from 'react-redux'

import Textarea from '../../components/textarea'
import Search from '../../components/Search'
import Button from '../../components/button'

import { getBlacklist, setBlacklist } from '../../store/actions/blacklist'

class Moderation extends Component {
  state = {
    blacklist: "",
  }
  componentDidMount() {
    this.props.getBlacklist()
  }

  changeText = (event) => {
    this.setState({ blacklist: event.target.value })
  }

  submitDemo = async () => {
    await this.props.setBlacklist(this.state.blacklist)
    await this.props.getBlacklist()
  }

  render() {
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
          <Textarea value={this.state.blacklist} onChange={this.changeText}></Textarea>
          <Button onClick={this.submitDemo}>Blacklist</Button>
        </div>
        <div>
          <h3>CurrentBlacklist</h3>
          {(this.props.blacklist || []).map((card, i) => <div key={i}>{card}</div>)}
        </div>
      </div>

    )
  }
}

const mapStateToProps = (state) => ({
  blacklist: state.cardBlacklist
})

const mapDispatchToProps = {
  getBlacklist,
  setBlacklist,
}

export default connect(mapStateToProps, mapDispatchToProps)(Moderation)
