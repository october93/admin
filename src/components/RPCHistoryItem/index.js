import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import './style.scss'

export default class RPCHistoryItem extends Component {

  constructor(props){
    super(props)
  }

  render() {
    return (
      <li onClick={() => this.props.handleClick(this.props.content)}>{this.props.content}</li>
    )
  }
}
