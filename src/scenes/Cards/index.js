import React, { Component } from 'react'
import Link from '../../components/link'
import { connect } from 'react-redux'
import boost from './boost.png'
import bury from './bury.png'
import { getCardsWithStats } from '../../store/actions/cards'
import ReactTable from 'react-table'
import glamorous from "glamorous"

import TruncatedWithCopy from '../../components/truncatedWithCopy'


const { REACT_APP_APP_HOST } = process.env

const Emblem = glamorous.img({
  width: "1rem",
  height: "1rem",
})

const columns = [{
  Header: 'Card ID',
  id: 'id',
  accessor: c => c,
  Cell: props =>
  <div style={{ display: "flex", flexDirection: "row"}}>
    <TruncatedWithCopy id={props.value.id} />
    <div style={{width: "20px"}} />
    <Link href={`${REACT_APP_APP_HOST}/post/${props.value.id}`} target="_blank">Go To Card</Link>
  </div>
}, {
  Header: 'Author',
  accessor: 'apparentAuthor.displayName',
  filterable: true,
}, {
  accessor: 'stats.boosts',
  sortable: true,
  defaultSortDesc: true,
  Header: props => <span>Boosts <Emblem src={boost} alt="thunderbolt" /></span>
}, {
  accessor: 'stats.buries',
  sortable: true,
  defaultSortDesc: true,
  Header: props => <span>Buries <Emblem src={bury} alt="cross" /></span>

}, {
  Header: 'Views',
  accessor: 'stats.views',
  sortable: true,
  defaultSortDesc: true,
},
]

class Cards extends Component {
  componentDidMount() {
    this.props.getCardsWithStats()
  }

  render() {
    if (this.props.isLoading) {
      return "Loading…"
    }
    return (
      <div style={{ width: "100%", margin: "10px"}}>
        <ReactTable
          data={Object.values(this.props.cards)}
          columns={columns}
          defaultPageSize={50}
          minRows={0}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    cards: state.cardsCardsLoadingSuccess,
    error: state.cardsCardsLoadingFailure,
    isLoading: state.cardsCardsAreLoading,
    sortBy: state.cardsSortedBy,
  }
}

const mapDispatchToProps = {
  getCardsWithStats,
}

export default connect(mapStateToProps, mapDispatchToProps)(Cards)
