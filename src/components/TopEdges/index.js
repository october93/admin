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

  filterEdge(edge) {
    const source = this.props.data.usersByID[edge.sourceID].username
    const target = this.props.data.usersByID[edge.targetID].username
    const usernames = this.props.usernameFilter

    if (this.props.usernameFilter.length === 0) {
      // no filter, include everyone
      return true
    } else if (this.props.usernameFilter.length === 1) {
      // include all nodes with a direct edge to the user
      return usernames.includes(source) || usernames.includes(target)
    } else {
      // include only the nodes listed in the filter
      return usernames.includes(source) && usernames.includes(target)
    }
  }

  render() {
    let weights = this.props.data.edgesByUpWeight
    if (this.props.sort.sortBy === 'downWeight') {
      weights = this.props.data.edgesByDownWeight
    }

    weights = weights.filter(edge => this.filterEdge(edge))
    if (this.props.sort.direction === 'desc') {
      weights.reverse()
    }

    const Weights = (
      weights.slice(0, this.props.limit).map((edge, i) => (
        <tr key={i} onMouseEnter={this.handleHighlight(edge.sourceID, edge.targetID)} onMouseLeave={this.handleUnhighlight(edge.sourceID, edge.targetID)}>
          <td>{this.props.data.usersByID[edge.sourceID].username}</td>
          <td>{this.props.data.usersByID[edge.targetID].username}</td>
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
    usernameFilter: state.filteredUsers,
  }
}

export default connect(mapStateToProps)(TopEdges)
