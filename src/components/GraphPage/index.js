import React, { Component } from 'react'

import {Sigma, RandomizeNodePositions, RelativeSize, EdgeShapes} from 'react-sigma'

import ForceLink from 'react-sigma/lib/ForceLink'

import './style.scss';


export default class GraphPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedNodeID: null,
      selectedNodeLabel: null,
    }

    this.nodeClicked = this.nodeClicked.bind(this)
    this.edgeClicked = this.edgeClicked.bind(this)

    const data = [["GRAPHDATA", {"NodeData":[{"id":"77271d92-2518-4202-6fd5-51dc064361bf","name":"Hacker News"},{"id":"3a3a92b1-14ba-4678-8dc3-ed286e749d65","name":"Chad"},{"id":"86a6acb1-2c56-43a4-b1c0-221d6119169b","name":"Test User"}],"EdgeData":[{"id":"4a0ae5fa-05a3-4ef8-a7be-9164bb318104","sourceid":"3a3a92b1-14ba-4678-8dc3-ed286e749d65","targetid":"77271d92-2518-4202-6fd5-51dc064361bf"},{"id":"16733a56-4989-433a-b47f-5f1f25748087","sourceid":"77271d92-2518-4202-6fd5-51dc064361bf","targetid":"3a3a92b1-14ba-4678-8dc3-ed286e749d65"},{"id":"24725c92-37f0-4e90-86b2-3168ae784ad7","sourceid":"86a6acb1-2c56-43a4-b1c0-221d6119169b","targetid":"3a3a92b1-14ba-4678-8dc3-ed286e749d65"},{"id":"34599c36-d516-4e1e-a086-23644f27dbba","sourceid":"77271d92-2518-4202-6fd5-51dc064361bf","targetid":"86a6acb1-2c56-43a4-b1c0-221d6119169b"},{"id":"65982417-7415-4439-a1f9-c928e9328843","sourceid":"3a3a92b1-14ba-4678-8dc3-ed286e749d65","targetid":"86a6acb1-2c56-43a4-b1c0-221d6119169b"},{"id":"69716b00-41cd-4376-894d-50bd41527da7","sourceid":"86a6acb1-2c56-43a4-b1c0-221d6119169b","targetid":"77271d92-2518-4202-6fd5-51dc064361bf"}]}]]
    //const data = [["GRAPHDATA", {"NodeData":[{"id":"77271d92-2518-4202-6fd5-51dc064361bf","name":"Hacker News"},{"id":"3a3a92b1-14ba-4678-8dc3-ed286e749d65","name":"Chad"},{"id":"86a6acb1-2c56-43a4-b1c0-221d6119169b","name":"Test User"}],"EdgeData":[{"id":"4a0ae5fa-05a3-4ef8-a7be-9164bb318104","sourceid":"3a3a92b1-14ba-4678-8dc3-ed286e749d65","targetid":"77271d92-2518-4202-6fd5-51dc064361bf"},{"id":"24725c92-37f0-4e90-86b2-3168ae784ad7","sourceid":"86a6acb1-2c56-43a4-b1c0-221d6119169b","targetid":"3a3a92b1-14ba-4678-8dc3-ed286e749d65"},{"id":"69716b00-41cd-4376-894d-50bd41527da7","sourceid":"86a6acb1-2c56-43a4-b1c0-221d6119169b","targetid":"77271d92-2518-4202-6fd5-51dc064361bf"}]}]]

    console.log(data)
    this.nodeData = []
    this.edgeData = []

    for (let i = 0; i < data[0][1].NodeData.length; i++){
      const n = data[0][1].NodeData[i]
      const tmp = {"id": n.id, "label": n.name, "dad": "shut up"}
      this.nodeData.push(tmp)
    }

    for (let i = 0; i < data[0][1].EdgeData.length; i++){
      const n = data[0][1].EdgeData[i]
      const tmp = {"id": n.id, "source": n.sourceid, "target": n.targetid}
      this.edgeData.push(tmp)
    }

  }

  nodeClicked(evt) {
    this.setState({selectedNodeID: evt.data.node.id, selectedNodeLabel: evt.data.node.label})
  }

  edgeClicked(evt){
    console.log("hello?")
    console.log(evt.data.edge.id)
  }

  render() {
    console.log(this.nodeData)
    console.log(this.edgeData)
    return (
    	<div className="row">
        <div className="small-4 columns">
          <p>ID: {this.state.selectedNodeID}</p>
          <p>Name: {this.state.selectedNodeLabel}</p>
        </div>
        <div className="columns">
          <Sigma
            verbose={true}
            renderer="canvas"
            onClickNode={this.nodeClicked}
            onClickEdge={e => console.log("Edge click: " + e.data.edge.label)}
            style={{height: 600}}
            graph={{nodes: this.nodeData, edges: this.edgeData}}
            settings={{
              sideMargin: 20,
              defaultLabelColor: "#999",
              drawEdges: true,
              minArrowSize: 10,
              labelThreshold: 0,
              }}>
            <EdgeShapes default="arrow" />
            <RelativeSize initialSize={40}/>
            <RandomizeNodePositions />
            <ForceLink />
          </Sigma>
        </div>
      </div>
    )
  }
}
