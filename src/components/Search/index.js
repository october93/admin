import React, { Component } from 'react'
import { Hits, SearchBox } from 'react-instantsearch/dom'
import Card from '../../components/Card'
import glamorous from "glamorous"

const StyledHits = glamorous(Hits)({
    listStyleType: "none",
    margin: 0,
    padding: 0,
})

class Search extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.state = {showHits: false}
  }
  handleChange(event) {
    this.setState({showHits: event.target.value.length > 0})
  }
  render() {
    return (
      <div className="container">
        <SearchBox onChange={this.handleChange} />
        <div style={this.state.showHits ? null : {display: 'none'}}>
        <StyledHits hitComponent={Card} />
      </div>
      </div>
    )
  }
}

export default Search
