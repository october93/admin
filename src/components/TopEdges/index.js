import React, { Component } from 'react'
import { Tooltip } from 'react-tippy'
import { connect } from 'react-redux'
import { limitTopEdges, highlightEdge, unhighlightEdge, sortEdges } from '../../store/actions/graphexplorer'
import glamorous from "glamorous"

const SortTH = glamorous.th({
  cursor: "pointer",
  backgroundColor: "#11a6f3",
})

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

  handleSort(sortBy) {
    const direction = (this.props.sort.direction === 'asc') ? 'desc' : 'asc'
    return (event) => {
      this.props.dispatch(sortEdges({sortBy, direction}))
    }
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

  limitLabel(count) {
    let limit = this.props.limit
    if (limit > count) {
      limit = count
    }
    return `${limit} / ${count}`
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

    const UpTableHeader = () => {
      let sortIndicator = ""
      if (this.props.sort.sortBy === 'upWeight') {
        sortIndicator = (this.props.sort.direction === 'asc') ? '▲' : '▼'
      }
      return (<SortTH onClick={this.handleSort('upWeight')}>Up Weight {sortIndicator}</SortTH>)
    }

    const DownTableHeader = () => {
      let sortIndicator = ""
      if (this.props.sort.sortBy === 'downWeight') {
        sortIndicator = (this.props.sort.direction === 'asc') ? '▲' : '▼'
      }
      return (<SortTH onClick={this.handleSort('downWeight')}>Down Weight {sortIndicator}</SortTH>)
    }

    const count = weights.length
    const Weights = (
      weights.slice(0, this.props.limit).map((edge, i) => (
        <tr key={i} onMouseEnter={this.handleHighlight(edge.sourceID, edge.targetID)} onMouseLeave={this.handleUnhighlight(edge.sourceID, edge.targetID)}>
          <td>{this.props.data.usersByID[edge.sourceID].username}</td>
          <td>{this.props.data.usersByID[edge.targetID].username}</td>
          <td><Tooltip title={edge.upWeight}>{parseFloat(edge.upWeight.toFixed(2))}</Tooltip></td>
          <td><Tooltip title={edge.downWeight}>{parseFloat(edge.downWeight.toFixed(2))}</Tooltip></td>
        </tr>
      ))
    )
    return (
      <div style={{ paddingRight: 0 }}>
        <label htmlFor="limit">Top Edges ({this.limitLabel(count)})</label>
        <input style={{ marginBottom: 0 }} type="text" name="limit" onChange={this.handleChange} value={this.props.limit} />
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <UpTableHeader/>
              <DownTableHeader />
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
