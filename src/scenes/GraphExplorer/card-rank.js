import React, { Component } from 'react'
import { Tooltip } from 'react-tippy'
import ReactTable from 'react-table'
import glamorous from "glamorous"

import CardLink from '../../components/CardLink'
import Button from '../../components/button'

const LimitByUserContainer = glamorous.div({
  padding: "10px 0px",
})

const BasicFilterContainer = glamorous.div({
  paddingBottom: "10px",
})


class CardRank extends Component {
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
    return [{
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
      Header: '#',
      id: "index",
      filterable: this.state.advancedFiltering === true,
      filterMethod: (filter, row) => row[filter.id] === filter.value,
      accessor: d => `${d.index + 1}`,
      width: 50,
    }, {
      Header: 'Card ID',
      accessor: 'card',
      filterable: this.state.advancedFiltering === true,
      filterMethod: (filter, row) => {
        return (row[filter.id].cardID || "").startsWith(filter.value)
      },
      Cell: props => <CardLink cardID={props.value.cardID} card={props.value}/>
    }, {
      Header: "Score",
      accessor: 'score',
      Cell: props => <Tooltip title={props.value}>{parseFloat((props.value || 0.0).toFixed(2))}</Tooltip>
    }]
  }

  render() {
    const { advancedFiltering, selectedUser } = this.state

    const filteredRanks = advancedFiltering || !selectedUser ? this.props.cardRanks
      : this.props.cardRanks.filter(cr => cr.username === this.state.selectedUser)

    return (
      <div style={{ width: "100%"}}>
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
         data={filteredRanks}
         columns={this.makeColumns()}
         defaultPageSize={100}
         showPagination={advancedFiltering}
         minRows={0}
        />
      </div>
    )
  }
}

export default CardRank
