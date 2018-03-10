import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Viva from 'vivagraphjs';
import { connect } from 'react-redux'

import './index.css'

class Graph extends Component {
  constructor(props) {
    super(props)
    this.graph = Viva.Graph.graph()

    this.usersByID = this.props.data.graph.users.reduce((map, user) => {
      map[user.nodeId] = user
      return map
    }, {})

    this.neighborUsernamesByID = {}

    if (this.props.data.graph !== undefined) {
      this.props.data.graph.edges.forEach((edge, i) => {
        if (this.neighborUsernamesByID[edge.sourceID] === undefined) {
          this.neighborUsernamesByID[edge.sourceID] = []
        }
        this.neighborUsernamesByID[edge.sourceID].push(this.usersByID[edge.targetID].username)
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

  filterNodes() {
    let users = this.props.data.graph.users.filter(user => {
      if (this.props.usernames.length === 0) {
        return true
      } else if (this.props.usernames.length === 1) {
        return this.props.usernames[0] === user.username || this.neighborUsernamesByID[user.nodeId].includes(this.props.usernames[0])
      } else {
        return this.props.usernames.includes(user.username)
      }
    })

    let edges = this.props.data.graph.edges.filter(edge => {
      if (this.props.usernames.length === 0) {
        return true
      } else if (this.props.usernames.length === 1) {
        return this.neighborUsernamesByID[edge.sourceID].includes(this.props.usernames[0]) || this.neighborUsernamesByID[edge.targetID].includes(this.props.usernames[0])
      } else {
        return this.props.usernames.includes(this.usersByID[edge.sourceID].username) && this.props.usernames.includes(this.usersByID[edge.targetID].username)
      }
    })

    this.removeAll(users.map(u => u.nodeId), edges.map(e => e.sourceID + "👉 " + e.targetID))

    users.forEach(user => {
      if (this.graph.getNode(user.nodeId) === undefined) {
        this.graph.addNode(user.nodeId, user)
      }
    })
    edges.forEach(edge => {
      if (!this.graph.hasLink(edge.sourceID, edge.targetID)) {
        this.graph.addLink(edge.sourceID, edge.targetID, edge)
      }
    })
  }

  removeAll(users, edges) {
    this.graph.forEachLink(link => {
      if (!edges.includes(link.id)) {
        this.graph.removeLink(link.id)
      }
    })
    this.graph.forEachNode(n => {
      if (!users.includes(n.id)) {
        this.graph.removeNode(n.id)
      }
    })
  }

  render() {
    if (this.props.unhighlightedEdge !== null) {
      this.filterNodes()
    }
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
    unhighlightEdge: state.unhighlightedEdge,
    usernames: state.filteredUsers
  }
}

export default connect(mapStateToProps)(Graph)
