import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Viva from 'vivagraphjs';
import { connect } from 'react-redux'

import './index.css'

class Graph extends Component {
  constructor(props) {
    super(props)
    this.graph = Viva.Graph.graph()
    if (this.props.data.graph !== undefined) {
      this.props.data.graph.users.forEach((user, i) => {
        this.graph.addNode(user.nodeId, user)
      })
      this.props.data.graph.edges.forEach((edge, i) => {
        this.graph.addLink(edge.sourceID, edge.targetID, edge)
      })
    }
  }

  componentDidMount() {
    const container = ReactDOM.findDOMNode(this)
    this.graphics = Viva.Graph.View.svgGraphics();
    this.renderer = Viva.Graph.View.renderer(this.graph, {
      container: container,
      graphics: this.graphics
    })
    this.configureLabels()
    this.renderer.run()
  }

  configureLabels() {
    const nodeSize = 10
    this.graphics.node(node => {
      const nodeUI = Viva.Graph.svg('g')
      const rect = Viva.Graph.svg('rect').attr('fill', '#00a2e8').attr('width', nodeSize).attr('height', nodeSize)
      const label = Viva.Graph.svg('text').text(node.data.username)
      nodeUI.append(rect)
      nodeUI.append(label)
      return nodeUI
    }).placeNode(function(nodeUI, pos) {
      nodeUI.attr('transform', 'translate(' + (pos.x - nodeSize/2) + ',' + (pos.y - nodeSize/2) + ')');
    });
  }

  render() {
    if (this.renderer !== undefined) {
      const linkHighlightUI = this.graphics.getLinkUI(this.props.highlightEdge)
      if (linkHighlightUI !== undefined) {
        linkHighlightUI.attr('stroke', 'red')
      }
      const linkUnhighlightUI = this.graphics.getLinkUI(this.props.unhighlightEdge)
      if (linkUnhighlightUI !== undefined) {
        linkUnhighlightUI.attr('stroke', '#999')
      }
      this.renderer.run()
    }
    return(
      <div className="Graph"></div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    highlightEdge: state.highlightedEdge,
    unhighlightEdge: state.unhighlightedEdge
  }
}

export default connect(mapStateToProps)(Graph)
