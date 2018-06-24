import React, { Fragment } from 'react'
import glamorous from "glamorous"

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
