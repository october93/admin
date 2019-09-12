import React, { Component } from 'react'
import { connect } from 'react-redux'

import DangerZone from './danger-zone'

class Moderation extends Component {
  render() {
    return (
      <div style={{ width: "100%" }}>
        <DangerZone />
      </div>

    )
  }
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(Moderation)
