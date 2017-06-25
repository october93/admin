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
    // create GraphQL client
    let graphQLEndpoint = `${location.origin}/graphql`
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      graphQLEndpoint = 'http://localhost:8080/graphql'
    }
    this.client = new ApolloClient({
      networkInterface: createNetworkInterface({
        uri: graphQLEndpoint
      }),
    })

    this.buildGraph = this.buildGraph.bind(this)
  }

  buildGraph(graph, data) {
    for (let i = 0; i < data.graph.users.length; i++) {
      let user = data.graph.users[i];
      graph.addNode(user.nodeId, user)
    }
    for (let i = 0; i < data.graph.edges.length; i++) {
      let edge = data.graph.edges[i];
      graph.addLink(edge.sourceID, edge.targetID);
    }
    this.setState({graph: graph});
  }

  componentDidMount() {
    let graph = Viva.Graph.graph();
    let graphics = Viva.Graph.View.svgGraphics();
    let nodeSize = 24;
    graphics.node(function(node) {
      // This time it's a group of elements: http://www.w3.org/TR/SVG/struct.html#Groups
      let ui = Viva.Graph.svg('g')
        // Create SVG text element with user id as content
      let rect = Viva.Graph.svg('rect').attr('fill', "#1aafdb").attr("width", 20).attr("height", 20).attr('y', '-4px').attr('x', '4px')
      let tooltip = Viva.Graph.svg('title').text("What\nlol")
      ui.append(rect);
      ui.append(tooltip);
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
        var toNodeSize = nodeSize,
            fromNodeSize = nodeSize;
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

    this.renderer = Viva.Graph.View.renderer(graph, {
      graphics: graphics,
      layout: layout,
      container: document.getElementById('graph')
    });
    this.client.query({
      query: gql`
        {
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
          }
        }
      `,
    }).then(response => this.buildGraph(graph, response.data))
      .catch(error => console.error(error));
  }

  render() {
    if (this.renderer !== undefined) {
      this.renderer.run()
    }
    return (
      <div className="graph-wrapper">
        <div id="graph"></div>
      </div>
    )
  }
}
