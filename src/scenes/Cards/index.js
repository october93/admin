import React, { Component } from 'react'
import CardLink from '../../components/CardLink'
import { connect } from 'react-redux'
import boost from './boost.png'
import bury from './bury.png'
import { getCardsWithStats } from '../../store/actions/cards'
import ReactTable from 'react-table'

import './index.css'


const columns = [{
  Header: 'Card ID',
  accessor: 'card',
  Cell: props => <CardLink cardID={props.value.cardID} card={props.value} />
}, {
  Header: 'Author',
  accessor: 'author.displayname',
}, {
  accessor: 'stats.boosts',
  sortable: true,
  defaultSortDesc: true,
  Header: props => <span>Boosts <img className="Cards-icon" src={boost} alt="thunderbolt" /></span>
}, {
  accessor: 'stats.buries',
  sortable: true,
  defaultSortDesc: true,
  Header: props => <span>Buries <img className="Cards-icon" src={bury} alt="cross" /></span>

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
      <div style={{ height: "100%", width: "100%" }}>
        <ReactTable
          data={Object.values(this.props.cards)}
          columns={columns}
          defaultPageSize={25}
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
