import React, { Component } from 'react'
import Switch from 'rc-switch'
import { connect } from 'react-redux'
import glamorous from "glamorous"

import { getSettings, setSignupsFrozen, setMaintenanceMode } from '../../store/actions/home'


const Title = glamorous.span({
  fontWeight: "bold",
})

const Item = glamorous.div({
  marginBottom: "2rem",
})

class DangerZone extends Component {
  componentDidMount() {
    this.props.getSettings()
  }

  handleFreezeSignup = (checked) => {
    this.props.setSignupsFrozen(checked)
  }

  handleMaintenanceMode = (checked) => {
    this.props.setMaintenanceMode(checked)
  }

  render() {
    let freezeSignupChecked = this.props.freezeSignupChecked
    if (freezeSignupChecked == null) {
      freezeSignupChecked = this.props.settings.signupsFrozen
    }
    let maintenanceModeChecked = this.props.maintenanceModeChecked
    if (maintenanceModeChecked == null) {
      maintenanceModeChecked = this.props.settings.maintenanceMode
    }
    return (
      <div>
        <Item>
          <Title>Freeze Signups</Title>
          <div>Makes it impossible to sign up while this switch is active.</div>
          <Switch
            onClick={this.handleFreezeSignup}
            checked={freezeSignupChecked}
          />
        </Item>
        <Item>
          <Title>Maintenance Mode</Title>
          <div>Puts the backend into maintenance mode in which no new connections are accepted.</div>
          <Switch
            onClick={this.handleMaintenanceMode}
            checked={maintenanceModeChecked}
          />
        </Item>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    freezeSignupChecked: state.homeFreezeSignupsSwitched,
    maintenanceModeChecked: state.homeMaintenanceModeSwitched,
    settings: state.homeGetSettingsSuccess
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getSettings: (url) => dispatch(getSettings(url)),
    setSignupsFrozen: (url, on) => dispatch(setSignupsFrozen(url, on)),
    setMaintenanceMode: (url, on) => dispatch(setMaintenanceMode(url, on)),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DangerZone)
