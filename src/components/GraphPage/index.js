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
      var ui = Viva.Graph.svg('g'),
        // Create SVG text element with user id as content
        svgText = Viva.Graph.svg('text').attr('y', '-4px').text(node.data.username),
        img = Viva.Graph.svg('rect')
        .attr('width', nodeSize)
        .attr('height', nodeSize)
      ui.append(svgText);
      ui.append(img);
      return ui;
    }).placeNode(function(nodeUI, pos) {
      // 'g' element doesn't have convenient (x,y) attributes, instead
      // we have to deal with transforms: http://www.w3.org/TR/SVG/coords.html#SVGGlobalTransformAttribute
      nodeUI.attr('transform',
        'translate(' +
        (pos.x - nodeSize/2) + ',' + (pos.y - nodeSize/2) +
        ')');
    });

    let layout = Viva.Graph.Layout.forceDirected(graph, {
      springLength : 400,
      springCoeff : 0.0005,
      dragCoeff : 0.02,
      gravity : -1.2
    });

    this.renderer = Viva.Graph.View.renderer(graph, {
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
