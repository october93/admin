import React, { Component } from 'react';
import './style.scss'

export default class RPCHistoryItem extends Component {
  render() {
    return (
      <li className="historyItem" onClick={() => this.props.handleClick(this.props.content)}>
        <code>
          <pre>{this.props.content}</pre>
        </code>
      </li>
    )
  }
}
