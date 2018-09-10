import React, { Fragment } from 'react'
import TextareaAutosize from "react-autosize-textarea"
import glamorous from "glamorous"

const Textarea = glamorous(TextareaAutosize)(({ disabled }) => ({
  width: "100%",
  minHeight: "100px",
  color: disabled ? "#AAA" : "#000",

  "&:focus": {
    outline: "none",
  },
}))

const Label = glamorous.div({
  margin: "10px 0px",
})

const TextArea = ({ label, ...props}) => (
  <Fragment>
    { label && (
      <Label>{label}:</Label>
    )}
    <Textarea {...props}/>
  </Fragment>
)

export default TextArea
