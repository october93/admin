import React, { Fragment } from 'react'
import glamorous from "glamorous"

const StyledInput = glamorous.input({
  margin: "0px",
  height: "20px",
  borderRadius: "3px",
  border: "1px solid gray",
  padding: "7px",
  fontSize: "16px",

  "&:focus": {
    outline: "none",
  }
})

const Label = glamorous.div({
  margin: "10px 0px",
})

const TextInput = ({ label, ...props}) => (
  <Fragment>
    { label && (
      <Label>{label}:</Label>
    )}
    <StyledInput type="text" {...props}/>
  </Fragment>
)

export default TextInput
