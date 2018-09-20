import React, { Component } from 'react'
import glamorous from "glamorous"


import {
  FaAngleRight,
  FaAngleDown,
} from 'react-icons/fa';

const Container = glamorous.div({})

const Header = glamorous.div({ display: "flex", alignItems: "center", marginBottom: "10px"})
const HeaderText = glamorous.span({fontSize: "16px", fontWeight: "bold" })
const Spacer = glamorous.div(({ width }) => ({ width }))

const Children = glamorous.div({})

export default class CollapsibleContainer extends Component {
  state = {
    expanded: false
  }

  render() {
    const { children, label } = this.props
    const { expanded } = this.state
    return (
      <Container>
        <Header
          onClick={() => this.setState({expanded: !expanded})}>
          <HeaderText>{label || "Section"}</HeaderText>
          <Spacer width="5px" />
          {expanded ? <FaAngleDown size={16} /> : <FaAngleRight size={16} />}
        </Header>
        { expanded ? <Children>{children}</Children> : null }
      </Container>
    )
  }
}
