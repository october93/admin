import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import gql from 'graphql-tag';

import GraphQLClient from '../../store/GraphQLClient';


export default class UserSelector extends Component {
  state = {
    options: [],
  }
  constructor(props) {
    super(props)
    this.loadOptions()
  }
  loadOptions = async () => {
    const { data } = await GraphQLClient.Client().query({
      errorPolicy: "ignore",
      query: gql`
        {
          users {
            username
          }
        }
      `
    })
    this.setState({ options: data.users.map(user => ({ value: user.username, label: user.username }))})
  }
  render() {
    return (
      <Select
        options={this.state.options}
        onChange={this.props.onChange}
        value={this.props.value}
        clearable={false}
      />
    )
  }
}