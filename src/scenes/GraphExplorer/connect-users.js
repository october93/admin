import React from 'react'
import glamorous from "glamorous"

import Button from "../../components/button"
import TextInput from "../../components/textinput"
import LayoutInline from "../../components/layout-inline"

const Label = glamorous.div({
  margin: "10px 0px",
})

const Container = glamorous.div({
  flex: 1,
})

const ConnectUsers = ({ connectUsers, connectAllUsers, ...rest }) =>
  <Container>
    <Label>
      Connect Users:
    </Label>
    <LayoutInline spacing="15px">
      <TextInput
        style={{ minWidth: "200px" }}
        placeholder={`username1, username2, ...`}
        {...rest}
      />
      <Button onClick={connectUsers}>Connect</Button>
      <Button onClick={connectAllUsers}>Connect All</Button>
    </LayoutInline>
  </Container>

export default ConnectUsers
