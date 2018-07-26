import React, { Component } from 'react'
import Tooltip from 'rc-tooltip'
import Markdown from 'react-markdown'
import glamorous from "glamorous"

import Link from "../link"

const { REACT_APP_APP_HOST } = process.env

const CardLinkTooltip = glamorous.div({
  backgroundColor: "#fff",
  maxWidth: "10rem",
  maxHeight: "10rem",
  textOverflow: "ellipsis",
  wordWrap: "break-word",
  overflow: "hidden",
})

class CardLink extends Component {
  render() {
    const link = <Link href={`${REACT_APP_APP_HOST}/post/${this.props.cardID}`} target="_blank">{this.props.cardID}</Link>

    return this.props.card && this.props.card.content ? (
        <Tooltip
          arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
          placement="right"
          overlay={
            <CardLinkTooltip>
              <Markdown source={this.props.card.content} />
            </CardLinkTooltip>
          }>
          <React.Fragment>
          {this.props.children || link}
          </React.Fragment>
        </Tooltip>
      ) : link
  }
}

export default CardLink
