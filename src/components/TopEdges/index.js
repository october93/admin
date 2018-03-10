import React, { Component } from 'react'
import { connect } from 'react-redux'
import { limitTopEdges, highlightEdge, unhighlightEdge, sortEdges } from '../../actions/graphexplorer'
import './index.css'

class TopEdges extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleHighlight = this.handleHighlight.bind(this)
    this.handleUnhighlight = this.handleUnhighlight.bind(this)
    this.handleSort = this.handleSort.bind(this)

    this.edgesByUpWeight = []
    this.edgesByDownWeight = []

    if (this.props.data !== undefined) {
      this.usersByID = this.props.data.users.reduce((map, user) => {
        map[user.nodeId] = user
        return map
      }, {})
      this.edgesByUpWeight = this.props.data.edges.map((k, v) => k).sort((a, b) => {
        return a.upWeight - b.upWeight
      })
      this.edgesByDownWeight = this.props.data.edges.map((k, v) => k).sort((a, b) => {
        return a.downWeight - b.downWeight
      })
    }
  }

  handleChange(event) {
    this.props.dispatch(limitTopEdges(event.target.value))
  }

  handleHighlight(sourceID, targetID) {
    return (event) => {
      this.props.dispatch(highlightEdge(sourceID, targetID))
    }
  }

  handleUnhighlight(sourceID, targetID) {
    return (event) => {
      this.props.dispatch(unhighlightEdge(sourceID, targetID))
    }
  }

  handleSort(event) {
    this.props.dispatch(sortEdges(event.target.value))
  }

  predicate(edge) {
    const source = this.usersByID[edge.sourceID].username
    const target = this.usersByID[edge.targetID].username

    if (this.props.usernames.length === 0) {
      return true
    } else if (this.props.usernames.length === 1) {
      return this.props.usernames.includes(source) || this.props.usernames.includes(target)
    } else {
      return this.props.usernames.includes(source) && this.props.usernames.includes(target)
    }
  }

  render() {
    let weights = this.edgesByUpWeight
    if (this.props.sort.sortBy === 'downWeight') {
      weights = this.edgesByDownWeight
    }

    weights = weights.filter(item => this.predicate(item))
    if (this.props.sort.direction === 'desc') {
      weights.reverse()
    }

    const Weights = (
      weights.slice(0, this.props.limit).map((edge, i) => (
        <tr key={i} onMouseEnter={this.handleHighlight(edge.sourceID, edge.targetID)} onMouseLeave={this.handleUnhighlight(edge.sourceID, edge.targetID)}>
          <td>{this.usersByID[edge.sourceID].username}</td>
          <td>{this.usersByID[edge.targetID].username}</td>
          <td>{edge.upWeight}</td>
          <td>{edge.downWeight}</td>
        </tr>
      ))
    )
    return (
      <div className="TopEdges">
        <label htmlFor="limit">Top Edges</label>
        <input className="TopEdges-limit" type="text" name="limit" onChange={this.handleChange} value={this.props.limit} />
        <label htmlFor="sort">Sort by</label>
        <select onChange={this.handleSort} value={this.props.sort.value}>
          <option value="upWeight-desc">▼ Up Weight</option>
          <option value="downWeight-desc">▼ Down Weight</option>
          <option value="upWeight-asc">▲ Up Weight</option>
          <option value="downWeight-asc">▲ Down Weight</option>
        </select>
        <table className="TopEdges-table">
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>UpWeight</th>
              <th>DownWeight</th>
            </tr>
          </thead>
          <tbody>
            {Weights}
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    limit: state.limitTopEdges,
    highlightEdge: state.highlightedEdge,
    sort: state.sortEdges,
    usernames: state.filteredUsers
  }
}

export default connect(mapStateToProps)(TopEdges)
