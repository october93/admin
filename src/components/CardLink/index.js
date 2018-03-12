import React, { Component } from 'react'
import Tooltip from 'rc-tooltip'

class CardLink extends Component {
  constructor(props) {
    super(props)
    let url = location.origin
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      url = 'http://localhost:3000/post'
    } else if (location.hostname === 'engine.october.news') {
      url = 'https://web.development.october.news/post'
    }
    this.url = url
  }

  tooltip() {
    return `Content: ${this.props.cards[this.props.cardID].card.body}`
  }

  render() {
    return (
      <Tooltip
        arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
        placement="right"
        overlay={<span>{this.tooltip()}</span>}>
        <a href={`${this.url}/${this.props.cardID}`}>{this.props.cardID}</a>
      </Tooltip>
    )
  }
}

export default CardLink
