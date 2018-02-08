import React, { Component } from 'react'
import Graph from '../../components/Graph'
import TopEdges from '../../components/TopEdges'
import DPC from '../../components/DPC'
import { queryGraph } from '../../actions/graphexplorer'
import { connect } from 'react-redux'

import './index.css' 

class GraphExplorerPage extends Component {
  constructor(props) {
    super(props)
    this.props.queryGraph('http://localhost:9000/graphql')
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
        <TopEdges data={this.props.data.graph} />
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
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    queryGraph: (url) => dispatch(queryGraph(url))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphExplorerPage)
