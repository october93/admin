import React from 'react'
import glamorous from "glamorous"

const CoppiedBar = glamorous.div(({ backgroundColor, color }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: "40px",
  backgroundColor: backgroundColor || "green",
  zIndex: 1000,
  color: color || "white",
  fontWeight: "semibold",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}))

export default ({ children, ...props }) => <CoppiedBar {...props} >{children}</CoppiedBar>
