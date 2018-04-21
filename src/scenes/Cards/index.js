import React, { Component } from 'react'
import CardLink from '../../components/CardLink'
import { connect } from 'react-redux'
import boost from './boost.png'
import bury from './bury.png'
import { getCardsWithStats } from '../../store/actions/cards'
import ReactTable from 'react-table'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { InstantSearch } from 'react-instantsearch/dom';
import Search from './search'
import glamorous from "glamorous"

const { REACT_APP_ALGOLIA_ENVIRONMENT } = process.env

const Emblem = glamorous.img({
  width: "1rem",
  height: "1rem",
})

const columns = [{
  Header: 'Card ID',
  accessor: 'card',
  width: 400,
  Cell: props => <CardLink cardID={props.value.cardID} card={props.value} />
}, {
  Header: 'Author',
  accessor: 'author.displayname',
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
      <Tabs style={{ height: "100%", width: "100%" }}>
        <TabList>
          <Tab>Cards</Tab>
          <Tab>Stats</Tab>
        </TabList>
        <TabPanel>
          <InstantSearch
            appId="0Z498T9C13"
            apiKey="b5dcca10ada97954dfc6b4d5b77786a4"
            indexName={REACT_APP_ALGOLIA_ENVIRONMENT}
            >
            <Search />
          </InstantSearch>
        </TabPanel>
        <TabPanel>
          <div>
            <ReactTable
              data={Object.values(this.props.cards)}
              columns={columns}
              defaultPageSize={100}
              minRows={0}
            />
          </div>
        </TabPanel>
      </Tabs>
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
