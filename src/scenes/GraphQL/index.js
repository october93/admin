import React, { Component } from 'react'
import GraphiQL from 'graphiql'
import fetch from 'isomorphic-fetch'

import './index.css'

const { REACT_APP_GRAPHQL_ENDPOINT } = process.env

export default class GraphQLPage extends Component {
  constructor(props) {
    super(props);
    this.fetch = this.fetch.bind(this)
  }

  fetch(params) {
    return fetch(REACT_APP_GRAPHQL_ENDPOINT, {
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
      <GraphiQL fetcher={this.fetch}  editorTheme="solarized light" />

    )
  }
}
