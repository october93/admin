import React, { Component } from 'react'
import CardLink from '../../components/CardLink'
import { Tooltip } from 'react-tippy'
import { connect } from 'react-redux'
import { selectUsername, limitVotes, sortVotes } from '../../actions/graphexplorer'
import './index.css'

class VoteTable extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleLimitChange = this.handleLimitChange.bind(this)
  }

  handleChange(event) {
    this.props.dispatch(selectUsername(event.target.value))
  }

  handleLimitChange(event) {
    this.props.dispatch(limitVotes(event.target.value))
  }

  handleSort(sortBy) {
    const direction = (this.props.sort.direction === 'asc') ? 'desc' : 'asc'
    return (event) => {
      this.props.dispatch(sortVotes({sortBy, direction}))
    }
  }

  sortVotes() {
    let votes = this.props.usersByID[this.props.selectedUser].node.votes
    console.log(votes)
    if (this.props.sort.sortBy === 'positiveScore') {
      votes = votes.map((k, v) => k).sort((a, b) => a.positiveScore - b.positiveScore)
    } else {
      votes = votes.map((k, v) => k).sort((a, b) => a.negativeScore - b.negativeScore)
    }
    if (this.props.sort.direction === 'desc') {
      votes.reverse()
    }
    return votes
  }

  limitLabel() {
    const count = this.props.usersByID[this.props.selectedUser].node.votes.length
    let limit = this.props.limit
    if (limit > count) {
      limit = count
    }
    return `${limit} / ${count}`
  }

  componentDidMount() {
    this.props.dispatch(selectUsername(this.props.users[0].nodeId))
  }

  render() {
    if (this.props.selectedUser === null) {
      return (<p>Loading…</p>)
    }
    const usernameOptions = this.props.users.map(user => (
      <option key={user.username} value={user.nodeId}>{user.username}</option>
    ))

    const Votes = (
      this.sortVotes().slice(0, this.props.limit).map((vote, i) => (
        <tr key={i}>
          <td><CardLink cardID={vote.cardID} cards={this.props.cards} /></td>
          <td><Tooltip title={vote.positiveScore}>{parseFloat(vote.positiveScore.toFixed(2))}</Tooltip></td>
          <td><Tooltip title={vote.negativeScore}>{parseFloat(vote.negativeScore.toFixed(2))}</Tooltip></td>
        </tr>
      ))
    )

    const PositiveTableHeader = () => {
      let sortIndicator = ""
      if (this.props.sort.sortBy === 'positiveScore') {
        sortIndicator = (this.props.sort.direction === 'asc') ? '▲' : '▼'
      }
      return (<th className="sort-th" onClick={this.handleSort('positiveScore')}>Positive Score {sortIndicator}</th>) 
    }

    const NegativeTableHeader = () => {
      let sortIndicator = ""
      if (this.props.sort.sortBy === 'negativeScore') {
        sortIndicator = (this.props.sort.direction === 'asc') ? '▲' : '▼'
      }
      return (<th className="sort-th" onClick={this.handleSort('negativeScore')}>Negative Score {sortIndicator}</th>) 
    }

    return (
      <div className="VoteTable">
        <label htmlFor="username">User</label>
        <select onChange={this.handleChange} value={this.props.username}>
          {usernameOptions}
        </select>
        <label htmlFor="limit">Top Votes ({this.limitLabel()})</label>
        <input className="VoteTable-limit" type="text" name="limit" onChange={this.handleLimitChange} value={this.props.limit} />
        <table className="VoteTable-table">
          <thead>
            <tr>
              <th>Card ID</th>
              <PositiveTableHeader />
              <NegativeTableHeader />
            </tr>
          </thead>
          <tbody>
            {Votes}
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    limit: state.limitedVotes,
    selectedUser: state.selectedUsername,
    sort: state.sortVotes
  }
}

export default connect(mapStateToProps)(VoteTable)
