import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Graph from '../../components/Graph'
import TopEdges from '../../components/TopEdges'
import CardRank from '../../components/CardRank'
import VoteTable from '../../components/VoteTable'
import { queryGraph, queryGraphAndCards, filterUsers } from '../../actions/graphexplorer'
import { connect } from 'react-redux'

import './index.css' 

class GraphExplorer extends Component {
  constructor(props) {
    super(props)
    this.handleFilter = this.handleFilter.bind(this)

    let endpoint = `${location.origin}/graphql`
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      endpoint = 'http://localhost:9000/graphql'
    }
    this.props.queryGraphAndCards(endpoint)
  }

  handleFilter(event) {
    this.props.dispatch(filterUsers(event.target.value))
  }

  render() {
    if (this.props.graphError !== null) {
      return <p className="error">{this.props.graphError.message}</p>
    }
    if (this.props.cardsError !== null) {
      return <p className="error">{this.props.cardsError.message}</p>
    }
    if (this.props.isGraphLoading || this.props.cardsAreLoading) {
      return <p>Loading…</p>
    }
    return (
      <div className="GraphExplorerPage">
        <label htmlFor="filter">Filter</label>
        <input type="text" name="filter" value={this.props.usernameFilter} onChange={this.handleFilter} placeholder="paul,eugene,chris,…" />
        <Tabs>
          <TabList>
            <Tab>Attention Rank</Tab>
            <Tab>Card Rank</Tab>
            <Tab>Vote Table</Tab>
          </TabList>
          <TabPanel>
            <TopEdges data={this.props.data} />  
          </TabPanel>
          <TabPanel>
            <CardRank
              usersByID={this.props.data.usersByID}
              users={this.props.data.graph.users}
              cards={this.props.cards}
            />
          </TabPanel>
          <TabPanel>
            <VoteTable
              usersByID={this.props.data.usersByID}
              users={this.props.data.graph.users}
              cards={this.props.cards} 
            />
          </TabPanel>
        </Tabs>
        <Graph
          usersByID={this.props.data.usersByID}
          graph={this.props.data.graph}
          followersByID={this.props.data.followersByID} 
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.graphLoadingSuccess,
    cards: state.cardsLoadingSuccess,
    graphError: state.graphLoadingFailure,
    cardsError: state.cardsLoadingFailure,
    isGraphLoading: state.graphIsLoading,
    cardsLoading: state.cardsAreLoading,
    usernameFilter: state.filteredUsers
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    queryGraph: (url) => dispatch(queryGraph(url)),
    queryGraphAndCards: (url) => dispatch(queryGraphAndCards(url)),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphExplorer)
