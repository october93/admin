import React, { Component } from 'react'
import Graph from '../../components/Graph'
import TopEdges from '../../components/TopEdges'
import DPC from '../../components/DPC'
import { queryGraph, filterUsers } from '../../actions/graphexplorer'
import { connect } from 'react-redux'

import './index.css' 

class GraphExplorerPage extends Component {
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
    console.log(this.props.usernames)
    if (this.props.error !== null) {
      return <p className="error">{this.props.error.message}</p>
    }
    if (this.props.isLoading) {
      return <p>Loading…</p>
    }
    return (
      <div className="GraphExplorerPage">
        <label htmlFor="filter">Filter</label>
        <input type="text" name="filter" value={this.props.usernames} onChange={this.handleFilter} placeholder="username1,username2,username3,..." />
        <TopEdges data={this.props.data.graph} filter={this.props.usernames} />
        <DPC users={this.props.data.graph.users} />
        <Graph data={this.props.data} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.graphLoadingSuccess,
    error: state.graphLoadingFailure,
    isLoading: state.graphIsLoading,
    usernames: state.filteredUsers
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    queryGraph: (url) => dispatch(queryGraph(url)),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphExplorerPage)
