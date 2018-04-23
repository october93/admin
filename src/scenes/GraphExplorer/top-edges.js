import React, { Component } from 'react'
import { Tooltip } from 'react-tippy'
import ReactTable from 'react-table'

const UNKNOWN = { username: "UNKNOWN" }

class TopEdges extends Component {
  makeColumns() {
    return [{
      Header: 'Attention Source',
      id: "attentionSource",
      accessor: d => (this.props.data.usersByID[d.sourceID] || UNKNOWN).username, //'sourceID',
      filterable: true,
      filterMethod: (filter, row) => {
        const filters = filter.value.split(",").map(d => d.trim())
        if (filters.includes(row[filter.id])) {
          return true
        }
        return false
      },
    }, {
      Header: 'Attention Target',
      id: "attentionTarget",
      accessor: d => (this.props.data.usersByID[d.targetID] || UNKNOWN).username,
      filterable: true,
      filterMethod: (filter, row) => {
        const filters = filter.value.split(",").map(d => d.trim())
        if (filters.includes(row[filter.id])) {
          return true
        }
        return false
      }
    }, {
      Header: "Up Weight",
      accessor: 'upWeight',
      Cell: props => <Tooltip title={props.value}>{parseFloat(props.value.toFixed(2))}</Tooltip>
    }, {
      Header: "Down Weight",
      accessor: 'downWeight',
      Cell: props => <Tooltip title={props.value}>{parseFloat(props.value.toFixed(2))}</Tooltip>
    }]
  }


  render() {
    let weights = this.props.data.edgesByUpWeight

    return (
      <div style={{ paddingRight: 0 }}>
        <ReactTable
         data={weights}
         columns={this.makeColumns()}
         defaultPageSize={100}
        />
      </div>
    )
  }
}


export default TopEdges
