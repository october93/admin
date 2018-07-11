import React, { Component } from 'react'
import { Tooltip } from 'react-tippy'
import ReactTable from 'react-table'
import { connect } from 'react-redux'


class TopEdges extends Component {
  makeColumns() {
    return [
      {
        Header: 'Attention Source',
        id: 'attentionSource',
        accessor: 'source.user.username',
      },
      {
        Header: 'Attention Target',
        id: 'attentionTarget',
        accessor: 'target.user.username',
      },
      {
        Header: 'Up Weight',
        accessor: 'upWeight',
        Cell: props => (
          <Tooltip title={props.value}>
            {parseFloat(props.value.toFixed(2))}
          </Tooltip>
        ),
      },
      {
        Header: 'Down Weight',
        accessor: 'downWeight',
        Cell: props => (
          <Tooltip title={props.value}>
            {parseFloat(props.value.toFixed(2))}
          </Tooltip>
        ),
      },
    ]
  }

  render() {
    let attentionRanks = this.props.following.concat(this.props.followers)

    return (
      <div style={{ paddingRight: 0 }}>
        <ReactTable
          data={attentionRanks}
          columns={this.makeColumns()}
          defaultPageSize={100}
        />
      </div>
    )
  }
}

export default connect((state, props) => ({
  following: state.graphLoadingSuccess[props.username].node.following,
  followers: state.graphLoadingSuccess[props.username].node.followers,
}))(TopEdges)
