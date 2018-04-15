import React, { Fragment } from 'react'
import glamorous from "glamorous"

const StyledInput = glamorous.input({
  margin: "5px",
  borderRadius: "100%",
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

const Checkbox = ({ label, ...props}) => (
  <Fragment>
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      <StyledInput type="checkbox" {...props}/>
      { label && (
        <Label>{label}</Label>
      )}
    </div>

  </Fragment>
)

export default Checkbox
