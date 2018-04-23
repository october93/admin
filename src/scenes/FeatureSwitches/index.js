import React, { Component } from 'react'
import { connect } from 'react-redux'
import Switch from 'rc-switch'

import { getSwitches, setFeatureSwitchState, newFeatureSwitch, deleteFeatureSwitch } from '../../store/actions/featureswitches'

class FeatureSwitches extends Component {
  componentDidMount() {
    this.props.getSwitches()
  }

  state = {
    newSwitchName: "",
    newSwitchState: false,
  }

  render() {
    if (this.props.isLoading) {
      return "Loading…"
    }

    const Switches = (
      [...this.props.featureSwitches].sort((a,b) => a.name > b.name ? 1 : -1).map((featureSwitch, i) => (
        <tr key={i}>
          <td>
            <span style={{ color: "#F00", fontWeight: "bold"}} onClick={async () =>{
                await this.props.deleteFeatureSwitch(featureSwitch.id)
                await this.props.getSwitches()
              }}>
              X
            </span>
          </td>
          <td>{featureSwitch.id}</td>
          <td>{featureSwitch.name}</td>
          <td>
            <Switch
              onClick={async () => {
                await this.props.setFeatureSwitchState(featureSwitch.id, featureSwitch.state === "on" ? "off" : "on")
                await this.props.getSwitches()
              }}
              checked={featureSwitch.state === "on"}
            />
        </td>
        </tr>
      ))
    )

    return (
      <div style={{ width: "100%"}}>
        <table>
          <col style={{width: "8px"}}/>
          <col />
            <col />
              <col/ >

          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Name</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            {Switches}
            <tr key={"edit"}>
              <td />
              <td style={{textAlign: "center" }}><button style={{ color: "#02A8F3", backgroundColor: "white", padding: "10px", borderRadius: "4px"}} onClick={async () => {
                  await this.props.newFeatureSwitch(this.state.newSwitchName, this.state.newSwitchState ? "on" : "off")
                  await this.props.getSwitches()
                  this.setState({ newSwitchName: "", newSwitchState: false })
                }}>Add Switch</button></td>
              <td><input value={this.state.newSwitchName} onChange={(e) => this.setState({ newSwitchName: e.target.value })} /></td>
              <td><Switch
                onClick={() => this.setState({ newSwitchState: !this.state.newSwitchState })}
                checked={this.state.newSwitchState}
              />
          </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = state => ({
    featureSwitchesLoading: state.featureSwitchesLoading,
    featureSwitches: state.featureSwitches,
  })

const mapDispatchToProps = {
  getSwitches,
  setFeatureSwitchState,
  newFeatureSwitch,
  deleteFeatureSwitch,
}


export default connect(mapStateToProps, mapDispatchToProps)(FeatureSwitches)
