import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Graph from '../../components/Graph'
import TopEdges from '../../components/TopEdges'
import VoteTable from '../../components/VoteTable'
import { queryGraph, filterUsers } from '../../actions/graphexplorer'
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
    this.props.queryGraph(endpoint)
  }

  handleFilter(event) {
    this.props.dispatch(filterUsers(event.target.value))
  }

  render() {
    if (this.props.error !== null) {
      return <p className="error">{this.props.error.message}</p>
    }
    if (this.props.isLoading) {
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
          </TabPanel>
          <TabPanel>
            <VoteTable usersByID={this.props.data.usersByID} users={this.props.data.graph.users} />
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
    error: state.graphLoadingFailure,
    isLoading: state.graphIsLoading,
    usernameFilter: state.filteredUsers
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    queryGraph: (url) => dispatch(queryGraph(url)),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphExplorer)
