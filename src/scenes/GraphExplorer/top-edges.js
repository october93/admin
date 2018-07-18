import React, { Component } from 'react'
import { Tooltip } from 'react-tippy'
import ReactTable from 'react-table'
import { connect } from 'react-redux'


const WeightCell = props => (
  <Tooltip title={props.value.weight}>
    {parseFloat(props.value.weight.toFixed(2))},{' '}
    {parseFloat(props.value.momentum.toFixed(2))}
</Tooltip>
)

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
        Cell: WeightCell,
      },
      {
        Header: 'Down Weight',
        accessor: 'downWeight',
        Cell: WeightCell,
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
