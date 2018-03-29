import React, { Component } from 'react'
import DangerZone from './danger-zone'

class Home extends Component {
  render() {
    return (
      <div style={{ width: "100%" }}>
        <DangerZone />
      </div>
    );
  }
}

export default Home;
