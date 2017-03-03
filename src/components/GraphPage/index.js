import React, { Component } from 'react'

import Graph from "react-graph-vis"
import { observer, inject } from 'mobx-react';

import { Button, Colors, Sizes} from 'react-foundation';


import './style.scss';

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
    const nodeClicked = this.nodeClicked
    const graphNodes = this.props.store.graphNodeData.toJS()
    const graphEdges = this.props.store.graphEdgeData.toJS()

    //console.log(`${JSON.stringify(nodes)}, ${JSON.stringify(edges)}`)


    console.log(`Render`)

    let graphElement = null

    if(this.props.store.graphLoaded) {
      const options = {
        edges: {
          color: "#000000"
        }
      }

      const events = {
        selectNode: function(event) {
          var { nodes, edges } = event;
          nodeClicked(nodes[0])
        }
      }

      let graph = {
        nodes: graphNodes,
        edges: graphEdges
      }


      graphElement = (<Graph graph={graph} options={options} events={events} />)
    }

    return (
      <div>
      	<div className="row">
          <div className="small-4 columns">
            <p>ID: {this.state.selectedNodeID}</p>
            <p>Name: {this.state.selectedNodeLabel}</p>
          </div>
          <div className="columns">
            {graphElement}
          </div>
        </div>

      </div>
    )
  }
}
