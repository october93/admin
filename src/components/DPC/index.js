import React, { Component } from 'react'
import { connect } from 'react-redux'
import { selectUsername, limit } from '../../actions/graphexplorer'

class DPC extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleLimitChange = this.handleLimitChange.bind(this)
    this.usersByID = this.props.users.reduce((map, user) => {
      map[user.nodeId] = user
      return map
    }, {})
    this.props.dispatch(selectUsername(this.props.users[0].nodeId))
  }

  handleChange(event) {
    this.props.dispatch(selectUsername(event.target.value))
  }

  handleLimitChange(event) {
    this.props.dispatch(limit(event.target.value))
  }

  render() {
    const usernameOptions = this.props.users.map(user => (
      <option key={user.username} value={user.nodeId}>{user.username}</option>
    ))

    let dpcRows = null;
    if (this.props.username !== "") {
      dpcRows = (
        this.usersByID[this.props.username].node.dpc.slice(0, this.props.limit).map((dpc, i) => (
          <tr key={i}>
            <td>{dpc.cardID}</td>
            <td>{dpc.positiveScore}</td>
            <td>{dpc.negativeScore}</td>
          </tr>
        ))
      )
    }

    return (
      <div className="DPC">
        <label htmlFor="username"></label>
        <select onChange={this.handleChange} value={this.props.username}>
          {usernameOptions}
        </select>
        <input className="DPC-limit" type="text" name="limit" onChange={this.handleLimitChange} value={this.props.limit} />
        <table>
          <thead>
            <tr>
              <th>Card ID</th>
              <th>Positive Score</th>
              <th>Negative Score</th>
            </tr>
          </thead>
          <tbody>
            {dpcRows}
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    limit: state.limited,
    username: state.selectedUsername
  }
}

export default connect(mapStateToProps)(DPC)
