import React, { Component } from 'react'
import { Tooltip } from 'react-tippy'
import { connect } from 'react-redux'
import CardLink from '../../components/CardLink'
import { selectCardRankUser, limitCardRank } from '../../actions/graphexplorer'
import './index.css'

class CardRank extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleLimitChange = this.handleLimitChange.bind(this)
  }

  handleChange(event) {
    this.props.dispatch(selectCardRankUser(event.target.value))
  }

  handleLimitChange(event) {
    this.props.dispatch(limitCardRank(event.target.value))
  }

  limitLabel() {
    const count = this.props.usersByID[this.props.selectedUser].node.cardRankTable.length
    let limit = this.props.limit
    if (limit > count) {
      limit = count
    }
    return `${limit} / ${count}`
  }

  componentDidMount() {
    this.props.dispatch(selectCardRankUser(this.props.users[0].nodeId))
  }

  render() {
    if (this.props.selectedUser === null) {
      return (<p>Loading…</p>)
    }
    const usernameOptions = this.props.users.map(user => (
      <option key={user.username} value={user.nodeId}>{user.username}</option>
    ))

    const Entries = (
      this.props.usersByID[this.props.selectedUser].node.cardRankTable.slice(0, this.props.limit).map((entry, i) => (
        <tr key={i}>
          <td><CardLink cardID={entry.card.cardID} cards={this.props.cards} /></td>
          <td><Tooltip title={entry.score}>{parseFloat(entry.score.toFixed(2))}</Tooltip></td>
        </tr>
      ))
    )

    return (
      <div className="CardRank">
        <label htmlFor="username">User</label>
        <select onChange={this.handleChange} value={this.props.username}>
          {usernameOptions}
        </select>
        <label htmlFor="limit">Top Cards ({this.limitLabel()})</label>
        <input className="CardRank-limit" type="text" name="limit" onChange={this.handleLimitChange} value={this.props.limit} />
        <table className="CardRank-table">
          <thead>
            <tr>
              <th>Card ID</th>
              <th>Score</th> 
            </tr>
          </thead>
          <tbody>
            {Entries}
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    limit: state.limitedCardRank,
    selectedUser: state.selectedCardRankUser,
  }
}

export default connect(mapStateToProps)(CardRank)
