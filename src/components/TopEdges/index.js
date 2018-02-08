import React, { Component } from 'react'
import { connect } from 'react-redux'
import { limitTopEdges, highlightEdge, unhighlightEdge } from '../../actions/graphexplorer'
import './index.css'

class TopEdges extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleHighlight = this.handleHighlight.bind(this)
    this.handleUnhighlight = this.handleUnhighlight.bind(this)

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

  render() {
    const UpWeights = (
      this.edgesByUpWeight.slice(0, this.props.limit).map((edge, i) => (
        <tr key={i} onMouseEnter={this.handleHighlight(edge.sourceID, edge.targetID)} onMouseLeave={this.handleUnhighlight(edge.sourceID, edge.targetID)}>
          <td>{this.usersByID[edge.sourceID].displayname}</td>
          <td>{this.usersByID[edge.targetID].displayname}</td>
          <td>{edge.upWeight}</td>
          <td>{edge.downWeight}</td>
        </tr>
      ))
    )
    return (
      <div className="TopEdges">
        <label htmlFor="limit">Top Edges</label>
        <input className="TopEdges-limit" type="text" name="limit" onChange={this.handleChange} value={this.props.limit} />
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
            {UpWeights}
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    limit: state.limitTopEdges,
    highlightEdge: state.highlightedEdge
  }
}

export default connect(mapStateToProps)(TopEdges)
