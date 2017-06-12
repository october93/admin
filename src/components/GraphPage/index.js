import React, { Component } from 'react'
import Graph from "react-graph-vis"
import { observer, inject } from 'mobx-react';

import './style.scss';

const graphoptions = {
  edges: {
    color: "#000000"
  }
}

@inject("store") @observer
export default class GraphPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedNodeID: null,
      selectedNodeLabel: null,
    }

    this.nodeClicked = this.nodeClicked.bind(this)
    this.edgeClicked = this.edgeClicked.bind(this)
  }

  nodeClicked(clickedNode) {
    const n = this.props.store.getNodeData(clickedNode)
    this.setState({selectedNodeID: n.id, selectedNodeLabel: n.label})
  }

  edgeClicked(evt){
    console.log("hello?")
    console.log(evt.data.edge.id)
  }

  render() {
    //const nodeClicked = this.nodeClicked
    console.log(`Render`)
    console.log()


    return (
      <div>
      	<div className="row">
          <div className="small-4 columns">
            <p>ID: {this.state.selectedNodeID}</p>
            <p>Name: {this.state.selectedNodeLabel}</p>
          </div>
          <div className="columns">
            <Graph graph={this.props.store.gdat} options={graphoptions} />
          </div>
        </div>

      </div>
    )
  }
}
