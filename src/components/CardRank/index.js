import React, { Component } from 'react'
import { Tooltip } from 'react-tippy'
import { connect } from 'react-redux'
import CardLink from '../../components/CardLink'
import { selectCardRankUser, limitCardRank } from '../../store/actions/graphexplorer'


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
          <td>{i+1}</td>
          <td><CardLink cardID={entry.card.cardID} cards={this.props.cards} /></td>
          <td><Tooltip title={entry.score}>{parseFloat(entry.score.toFixed(2))}</Tooltip></td>
        </tr>
      ))
    )

    return (
      <div style={{ width: "100%" }}>
        <label htmlFor="username">User</label>
        <select onChange={this.handleChange} value={this.props.username}>
          {usernameOptions}
        </select>
        <label htmlFor="limit">Top Cards ({this.limitLabel()})</label>
        <input type="text" name="limit" onChange={this.handleLimitChange} value={this.props.limit} />
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>#</th>
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
