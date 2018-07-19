import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Viva from 'vivagraphjs';
import { connect } from 'react-redux'
import glamorous from "glamorous"

const UNKNOWN = { username: "UNKNOWN" }

const StyledGraph = glamorous.div("Graph", {
  width: "100%",
  height: "100%",

    "& > svg": {
    width: "100%",
    height: "100%",
  }
})

class Graph extends Component {
  constructor(props) {
    super(props)
    this.graph = Viva.Graph.graph()
  }

  componentDidMount() {
    const container = ReactDOM.findDOMNode(this)
    this.graphics = Viva.Graph.View.svgGraphics()

    var layout = Viva.Graph.Layout.forceDirected(this.graph, {
      springLength : 70,
      springCoeff : 0.00005,
      dragCoeff : 0.3,
      gravity : -2.5,
    });


    this.renderer = Viva.Graph.View.renderer(this.graph, {
      container: container,
      graphics: this.graphics,
      layout: layout,
    })
    this.configureLabels()
    this.renderer.run()
  }

  configureLabels() {
    const nodeSize = 10
    this.graphics.node(node => {
      const nodeUI = Viva.Graph.svg('g')
      const rect = Viva.Graph.svg('rect').attr('fill', '#00a2e8').attr('width', nodeSize).attr('height', nodeSize)
      const label = Viva.Graph.svg('text').text((node.data || UNKNOWN).username)
      nodeUI.append(rect)
      nodeUI.append(label)
      return nodeUI
    }).placeNode(function(nodeUI, pos) {
      nodeUI.attr('transform', 'translate(' + (pos.x - nodeSize/2) + ',' + (pos.y - nodeSize/2) + ')');
    });
  }

  filterUser(user) {
    const usernames = this.props.usernameFilter
    const followersByID = this.props.followersByID
    if (this.props.usernames.length === 0) {
      // no filter, include everyone
      return true
    } else if (usernames.length === 1) {
      // include all nodes with a direct edge to the user
      return usernames[0] === user.username || followersByID[user.id].includes(usernames[0])
    } else {
      // include only the users listed in the filter
      return usernames.includes(user.username)
    }
  }

  filterEdge(edge) {
    if (this.props.usernames.length === 0) {
      return true
    } else if (this.props.usernames.length === 1) {
      const username = this.props.usernames[0]
      return this.props.usersByID[edge.sourceID] === username || this.props.usersByID[edge.targetID] === username
    } else {
      return this.props.usernames.includes(this.props.usersByID[edge.sourceID].username) && this.props.usernames.includes(this.props.usersByID[edge.targetID].username)
    }
  }

  createGraph() {
    let users = this.props.graph.users.filter(user => this.filterUser(user))
    let edges = this.props.graph.edges.filter(edge => this.filterEdge(edge))

    this.removeFiltered(users, edges)

    users.forEach(user => {
      // skip if the node already exists
      if (this.graph.getNode(user.id) === undefined) {
        this.graph.addNode(user.id, user)
      }
    })
    edges.forEach(edge => {
      // skip if the edge already exists
      if (!this.graph.hasLink(edge.sourceID, edge.targetID)) {
        this.graph.addLink(edge.sourceID, edge.targetID, edge)
      } else {
      }
    })
  }

  removeFiltered(users, edges) {
    users = users.map(u => u.id)
    edges = edges.map(e => e.sourceID + "👉 " + e.targetID)

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
    this.createGraph()
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
      <StyledGraph></StyledGraph>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    highlightEdge: state.highlightedEdge,
    unhighlightEdge: state.unhighlightedEdge,
    usernames: state.filteredUsers,
    usernameFilter: state.filteredUsers
  }
}

export default connect(mapStateToProps)(Graph)
