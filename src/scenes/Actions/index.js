import React, { Component } from 'react'
import { connect } from 'react-redux'
import qs from "query-string"
import glamorous from "glamorous"

import {
  shadowbanCard,
} from '../../store/actions/actions'


const Container = glamorous.div({
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  fontSize: "32px",
  fontWeight: "bold",
})
const Waiting = glamorous.div({})
const Success = glamorous.div({
  color: "green",
})
const Error = glamorous.div({
  color: "red",
})
const ErrorMsg = glamorous.div({
  color: "black",
  fontSize: "14px",
  fontWeight: "normal",
})


/*
Action examples

Shadowban Card
http://localhost:3200/admin/actions?action=shadowbanCard&cardid=b0aae830-2940-406f-9285-f774e15af969
Params
cardid - id of card to shadowban
*/
class Actions extends Component {
  state = {
    error: null,
    success: false,
    actionName: "",
  }
  componentDidMount = async() => {
    const queryParams = qs.parse(this.props.location.search)

    switch(queryParams.action) {
      case "shadowbanCard": {
        this.setState({ actionName: "Shadowban card" })
        const err = await this.props.shadowbanCard(queryParams.cardid)
        if (err) {
          console.log(err)
          this.setState({ error: err.message })
        } else {
          this.setState({ success: true })
        }
      }
      break
      default: {
        this.setState({ error: "Action not recognized." })
      }
    }
  }

  render() {
    const { error, success, actionName } = this.state
    return (
      <Container style={{ width: "100%" }}>
        { error ? (
          <React.Fragment>
            <Error>Error!</Error>
            <ErrorMsg>{error}</ErrorMsg>
          </React.Fragment>
        ) : success ? (
          <Success>{ actionName ? `${actionName} successful!`: "Success!"}</Success>
        ) : (
          <Waiting>Waiting...</Waiting>
        )}
      </Container>
    );
  }
}

const mapDispatchToProps = {
  shadowbanCard,
}

export default connect(() => ({}), mapDispatchToProps)(Actions)
;
