import React, { Component } from 'react'
import GraphiQL from 'graphiql'
import { observer, inject } from 'mobx-react'
import fetch from 'isomorphic-fetch'
import './index.css'

@inject("store") @observer
export default class GraphQLPage extends Component {
  fetch(params) {
    let endpoint = `${location.origin}/graphql`
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      endpoint = 'http://localhost:9000/graphql'
    }
    return fetch(endpoint, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    }).then(response => response.json())
  }

  render() {
    return (
      <GraphiQL fetcher={this.fetch} />
    )
  }
}
