import React, { Component } from 'react'
import Tooltip from 'rc-tooltip'
import Markdown from 'react-markdown'
import glamorous from "glamorous"

const CardLinkTooltip = glamorous.div({
  backgroundColor: "#fff",
  maxWidth: "10rem",
  maxHeight: "10rem",
  textOverflow: "ellipsis",
  wordWrap: "break-word",
  overflow: "hidden",
})

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

  render() {
    console.log(this.props)
    const link = <a href={`${this.url}/${this.props.cardID}`} target="_blank">{this.props.cardID}</a>

    return this.props.card && this.props.card.body ? (
        <Tooltip
          arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
          placement="right"
          overlay={
            <CardLinkTooltip>
              <Markdown source={this.props.card.body} />
            </CardLinkTooltip>
          }>
          {link}
        </Tooltip>
      ) : link
  }
}

export default CardLink
