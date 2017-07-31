import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import './style.scss'

export default class RPCHistoryItem extends Component {

  constructor(props){
    super(props)
  }

  render() {
    return (
      <li className="historyItem" onClick={() => this.props.handleClick(this.props.content)}><code>{this.props.content}</code></li>
    )
  }
}
