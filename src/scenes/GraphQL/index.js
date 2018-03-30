import React, { Component } from 'react'
import GraphiQL from 'graphiql'
import fetch from 'isomorphic-fetch'

import './index.css'

export default class GraphQLPage extends Component {
  constructor(props) {
    super(props);
    this.fetch = this.fetch.bind(this)
  }

  fetch(params) {
    let endpoint = `${location.origin}/graphql`
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      endpoint = 'http://localhost:9000/graphql'
    }
    return fetch(endpoint, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': JSON.parse(localStorage.getItem('session')).id,
      },
      body: JSON.stringify(params),
    }).then(response => response.json())
  }

  render() {
    return (
      <GraphiQL fetcher={this.fetch} />
    )
  }
}
