import React, { Component } from 'react'
import Switch from 'rc-switch'
import { connect } from 'react-redux'
import { getSettings, setSignupsFrozen, setMaintenanceMode } from '../../actions/home'
import './index.css'

class DangerZone extends Component {
  constructor(props) {
    super(props)
    this.handleFreezeSignup = this.handleFreezeSignup.bind(this)
    this.handleMaintenanceMode = this.handleMaintenanceMode.bind(this)

    let endpoint = `${location.origin}/graphql`
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      endpoint = 'http://localhost:9000/graphql'
    }
    this.endpoint = endpoint
    this.props.getSettings(this.endpoint)
  }

  handleFreezeSignup(checked) {
    this.props.setSignupsFrozen(this.endpoint, checked)
  }

  handleMaintenanceMode(checked) {
    this.props.setMaintenanceMode(this.endpoint, checked)
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
      <div className="DangerZone">
        <div className="DangerZone-item">
          <span className="DangerZone-title">Freeze Signups</span>
          <div className="DangerZone-description">Makes it impossible to sign up while this switch is active.</div>
          <Switch
            onClick={this.handleFreezeSignup}
            checked={freezeSignupChecked}
          />
        </div>       
        <div className="DangerZone-item">
          <span className="DangerZone-title">Maintenance Mode</span>
          <div className="DangerZone-description">Puts the backend into maintenance mode in which no new connections are accepted.</div>
          <Switch
            onClick={this.handleMaintenanceMode}
            checked={maintenanceModeChecked}
          />
        </div>       
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
