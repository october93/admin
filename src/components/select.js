import React, { Fragment } from 'react'
import glamorous from "glamorous"

const StyledSelect = glamorous.select({
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

const TextInput = ({ label, options, ...props}) => (
  <Fragment>
    { label && (
      <Label>{label}:</Label>
    )}
    <select {...props} >
      {
        options.map(o => <option key={o}>{o}</option>)
      }
    </select>
  </Fragment>
)

export default TextInput
