import React, { Component } from 'react'
import { observer, inject } from 'mobx-react';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import gql from 'graphql-tag';
import Viva from 'vivagraphjs';

import './style.scss';

@inject("store") @observer
export default class GraphPage extends Component {
  constructor(props) {
    super(props)

    this.client = new ApolloClient({
      networkInterface: createNetworkInterface({
        uri: this.props.store.graphqlURL
      }),
    })

    this.renderGraph = true;
    this.buildGraph = this.buildGraph.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.state = {selectedNode: {}, tooltipPosition: {top: 0, right: 0}, showNodeLabels: false, health: {synchronized: false, unknownNodes: false}}
  }

  buildGraph(graph, data) {
    for (let i = 0; i < data.graph.users.length; i++) {
      let user = data.graph.users[i];
      graph.addNode(user.nodeId, user)
    }
    for (let i = 0; i < data.tags.length; i++) {
      let tag = data.tags[i];
      graph.addNode(tag.node.id, tag)
    }
    for (let i = 0; i < data.graph.edges.length; i++) {
      let edge = data.graph.edges[i];
      graph.addLink(edge.sourceID, edge.targetID);
    }
  }

  configureGraph(showLabels) {
    let graph = Viva.Graph.graph();
    let graphics = Viva.Graph.View.svgGraphics();
    let nodeSize = 20;
    graphics.node((node) => {
      // This time it's a group of elements: http://www.w3.org/TR/SVG/struct.html#Groups
      let ui = Viva.Graph.svg('g')
      // Deal with unknown nodes
      if (node.data === undefined) {
        return
      }
      // Create SVG text element with user id as content
      let isTag = node.data.displayname === undefined
      let color = "#1aafdb"
      if (isTag) {
        color = "#666666"
      }
      let rect = Viva.Graph.svg('rect').attr('fill', color).attr("width", nodeSize).attr("height", nodeSize)
      let text = node.data.displayname
      if (text === undefined) {
        text = node.data.name
      }
      let label = Viva.Graph.svg('text').text(text).attr('class', 'nodeLabel')
      ui.append(rect);
      if (showLabels) {
        ui.append(label);
      }

      ui.addEventListener('mouseover', () => {
        this.setState({selectedNode: node.data, tooltipPosition: ui.getBoundingClientRect(), show: true});
      });
      ui.addEventListener('mouseout', () => {
        this.setState({show: false})
      });

      return ui;
    }).placeNode(function(nodeUI, pos) {
      // 'g' element doesn't have convenient (x,y) attributes, instead
      // we have to deal with transforms: http://www.w3.org/TR/SVG/coords.html#SVGGlobalTransformAttribute
      nodeUI.attr('transform',
        'translate(' +
        (pos.x - nodeSize/2) + ',' + (pos.y - nodeSize/2) +
        ')');
    });

    var createMarker = function(id) {
            return Viva.Graph.svg('marker')
                       .attr('id', id)
                       .attr('viewBox', "0 0 10 10")
                       .attr('refX', "10")
                       .attr('refY', "5")
                       .attr('markerUnits', "strokeWidth")
                       .attr('markerWidth', "10")
                       .attr('markerHeight', "5")
                       .attr('orient', "auto");
        },
        marker = createMarker('Triangle');
    marker.append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z');
    // Marker should be defined only once in <defs> child element of root <svg> element:
    var defs = graphics.getSvgRoot().append('defs');
    defs.append(marker);
    var geom = Viva.Graph.geom();
    graphics.link(function(link){
        // Notice the Triangle marker-end attribe:
        return Viva.Graph.svg('path')
                   .attr('stroke', 'gray')
                   .attr('marker-end', 'url(#Triangle)');
    }).placeLink(function(linkUI, fromPos, toPos) {
        // Here we should take care about
        //  "Links should start/stop at node's bounding box, not at the node center."
        // For rectangular nodes Viva.Graph.geom() provides efficient way to find
        // an intersection point between segment and rectangle

        // Padding is used for the distance between edge and node
        let padding = 10;

        var toNodeSize = nodeSize + padding,
            fromNodeSize = nodeSize + padding;
        var from = geom.intersectRect(
                // rectangle:
                        fromPos.x - fromNodeSize / 2, // left
                        fromPos.y - fromNodeSize / 2, // top
                        fromPos.x + fromNodeSize / 2, // right
                        fromPos.y + fromNodeSize / 2, // bottom
                // segment:
                        fromPos.x, fromPos.y, toPos.x, toPos.y)
                   || fromPos; // if no intersection found - return center of the node
        var to = geom.intersectRect(
                // rectangle:
                        toPos.x - toNodeSize / 2, // left
                        toPos.y - toNodeSize / 2, // top
                        toPos.x + toNodeSize / 2, // right
                        toPos.y + toNodeSize / 2, // bottom
                // segment:
                        toPos.x, toPos.y, fromPos.x, fromPos.y)
                    || toPos; // if no intersection found - return center of the node
        var data = 'M' + from.x + ',' + from.y +
                   'L' + to.x + ',' + to.y;
        linkUI.attr("d", data);
    });

    let layout = Viva.Graph.Layout.forceDirected(graph, {
      springLength : 400,
      springCoeff : 0.0005,
      dragCoeff : 0.04,
      gravity : -1.2
    });

    let graphDOM = document.getElementById('graph');
    graphDOM.innerHTML = null

    this.graph = graph;
    this.renderer = Viva.Graph.View.renderer(graph, {
      graphics: graphics,
      layout: layout,
      container: graphDOM,
    });
  }

  componentDidMount() {
    this.configureGraph(false)
    this.client.query({
      query: gql`
        {
          tags {
            name
            node {
              id
            }
          }
          graph {
            users {
              nodeId
              username
              displayname
            }
            edges {
              sourceID
              targetID
            }
            health {
              synchronized
              unknownNodes
            }
          }
        }
      `,
    }).then(response => this.setState({graphData: response.data, health: response.data.graph.health}))
      .catch(error => console.error(error));
  }

  handleOptionChange() {
    this.renderGraph = true;
    this.configureGraph(!this.state.showNodeLabels)
    this.setState({
      showNodeLabels: !this.state.showNodeLabels
    });
  }

  render() {
    if (this.renderer !== undefined && this.renderGraph) {
      this.buildGraph(this.graph, this.state.graphData);
      this.renderer.run()
      this.renderGraph = false;
    }
    const tooltipStyle = {
      top: this.state.tooltipPosition.top,
      right: this.state.tooltipPosition.right,
      display: this.state.show ? 'inline' : 'none',
    };
    return (
      <div className="graph-wrapper">
        <div className="health">
          <h4>Graph Health</h4>
          <table>
            <thead>
              <tr>
                <th scope="row">Attention & Flow Rank Synchronized</th>
                <td className={this.state.health.synchronized ? "success" : "danger"}>{this.state.health.synchronized ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <th scope="row">Unknown Nodes</th>
                <td className={this.state.health.unknownNodes ? "danger" : "success"}>{this.state.health.unknownNodes? "Yes" : "No"}</td>
              </tr>
            </thead>
          </table>
        </div>
        <div className="options">
          <h4>Options</h4>
          <label for="nodeLabels">
            Node Labels
          </label>
          <input
            name="nodeLabels"
            type="checkbox"
            checked={this.state.showNodeLabels}
            onChange={this.handleOptionChange} />
        </div>
        <div id="tooltip" style={tooltipStyle}>
          <ul>
            {Object.keys(this.state.selectedNode).map((key) => {
              if (key.startsWith('__')) {
                return null
              } else if (typeof this.state.selectedNode[key] === 'object') {
                return null
              } else {
                return <li><strong>{key}</strong> {this.state.selectedNode[key]}</li>;
              }
            })}
          </ul>
        </div>
        <div id="graph"></div>
      </div>
    )
  }
}
