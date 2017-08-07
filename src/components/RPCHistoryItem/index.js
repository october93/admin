import React, { Component } from 'react';
import './style.scss'

export default class RPCHistoryItem extends Component {
  render() {
    return (
      <li className="historyItem" onClick={() => this.props.handleClick(this.props.content)}><code>{this.props.content}</code></li>
    )
  }
}
