import React, { Component } from 'react'
import glamorous from "glamorous"

const HistoryItem = glamorous.li({
  marginBottom: "1em",
  paddingRight: "3em",
  marginLeft: "0",
  listStyleType: "none",
  cursor: "pointer",
  color: "#999",
  "& :hover": {
    color: "#000",
  },
})


const Code = glamorous.code({
  color: "inherit",
  backgroundColor: "none",
  border: "none",
  padding: "0",
})

const Pre = glamorous.pre({
  padding: "1em",
  border: "1px solid #cacaca",
  backgroundColor: "#fbfbfb",
  whiteSpace: "pre-wrap",
  wordWrap: "break-word",
})


export default class RPCHistoryItem extends Component {
  render() {
    return (
      <HistoryItem onClick={() => this.props.handleClick(this.props.content)}>
        <Code>
          <Pre>{this.props.content}</Pre>
        </Code>
      </HistoryItem>
    )
  }
}
