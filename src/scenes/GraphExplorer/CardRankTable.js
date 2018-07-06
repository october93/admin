import React, { Component } from 'react'
import { Tooltip } from 'react-tippy'
import ReactTable from 'react-table'
import { connect } from 'react-redux'

import CardLink from '../../components/CardLink'


class CardRankTable extends Component {
  makeColumns() {
    return [
      {
        Header: '#',
        id: "index",
        accessor: d => `${d.index + 1}`,
        width: 50,
      },
      {
        Header: 'Card ID',
        accessor: 'card',
        Cell: props => <CardLink cardID={props.value.id} card={props.value}/>
      },
      {
        Header: 'Top Score',
        id: 'topScore',
        accessor: d => d,
        Cell: props =>
        <Tooltip title={props.value.topScore}>
          {`${parseFloat((props.value.topScore || 0.0).toFixed(2))}${ props.value.scoreModifier ? ` (${props.value.scoreModifier > 0 ? '+' : '-'} ${Math.abs(props.value.scoreModifier)})`: ""}`}
        </Tooltip>
      },
      {
        Header: 'Boost Score',
        accessor: 'boostScore',
      },
      {
        Header: 'Bury Score',
        accessor: 'buryScore',
      },
      {
        Header: 'Modifier',
        accessor: 'scoreModifier',
      },
    ]
  }

  render() {
    let feed = this.props.feed

    return (
      <div style={{ paddingRight: 0 }}>
        <ReactTable
          data={feed.map((rank, index) => ({ index, ...rank }))}
          columns={this.makeColumns()}
          defaultPageSize={100}
        />
      </div>
    )
  }
}

export default connect((state, props) => ({
  feed: state.graphLoadingSuccess[props.username].feed,
}))(CardRankTable)