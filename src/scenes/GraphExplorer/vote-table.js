import React, { Component } from 'react'
import ReactTable from 'react-table'
import { Tooltip } from 'react-tippy'
import glamorous from "glamorous"

import CardLink from '../../components/CardLink'
import Button from '../../components/button'

const LimitByUserContainer = glamorous.div({
  padding: "10px 0px",
})

const BasicFilterContainer = glamorous.div({
  paddingBottom: "10px",
})

class VoteTable extends Component {
  state = {
    selectedUser: "",
    advancedFiltering: false,
  }

  handleChange = event => {
    this.setState({ selectedUser: event.target.value })
  }

  componentDidMount = () => {
    this.setState({ selectedUser: (this.props.users[0] || {}).username || "" })
  }

  makeColumns = () => {
    return [
      {
        Header: 'User',
        accessor: "username",
        filterable: true,
        filterMethod: (filter, row) => {
          const filters = filter.value.split(",").map(d => d.trim())
          if (filters.includes(row[filter.id])) {
            return true
          }
          return false
        },
        show: this.state.advancedFiltering === true,
        width: 150,
      }, {
        Header: 'Card ID',
        accessor: 'cardID',
        filterable: this.state.advancedFiltering === true,
        Cell: props => <CardLink cardID={props.value}/>
      }, {
        Header: "Positive Score",
        accessor: 'positiveScore',
        Cell: props => <Tooltip title={props.value}>{parseFloat((props.value || 0.0).toFixed(2))}</Tooltip>
      }, {
        Header: "Negative Score",
        accessor: 'negativeScore',
        Cell: props => <Tooltip title={props.value}>{parseFloat((props.value || 0.0).toFixed(2))}</Tooltip>
      }, {
        Header: "Score Modifier",
        accessor: 'scoreModifier',
        Cell: props => <Tooltip title={props.value}>{parseFloat((props.value || 0.0).toFixed(2))}</Tooltip>
      }, {
        Header: "Score",
        id: "score",
        accessor: d => d.positiveScore - d.negativeScore + d.scoreModifier,
        Cell: props => <Tooltip title={props.value}>{parseFloat((props.value || 0.0).toFixed(2))}</Tooltip>
      },
    ]
  }

  render() {
    const { advancedFiltering, selectedUser } = this.state

    const filteredVotes = advancedFiltering || !selectedUser ? this.props.cardVotes
      : this.props.cardVotes.filter(v => v.username === this.state.selectedUser)

    return (
      <div style={{width: "100%"}}>
        <LimitByUserContainer>
          { !advancedFiltering &&
            <BasicFilterContainer>
              <label>Filter by User: </label>
              <select onChange={this.handleChange} value={selectedUser || ""}>
                {this.props.users.map(user => (
                  <option key={user.username} value={user.username}>{user.username}</option>
                ))}
              </select>
            </BasicFilterContainer>
          }
          <Button onClick={() => this.setState({ advancedFiltering: !advancedFiltering })}>
            { advancedFiltering ? "Basic Filtering" : "Advanced Filtering"}
          </Button>
        </LimitByUserContainer>

        <ReactTable
         data={filteredVotes}
         columns={this.makeColumns()}
         defaultPageSize={100}
         showPagination={advancedFiltering}
         minRows={0}
        />
      </div>
    )
  }
}

export default VoteTable
