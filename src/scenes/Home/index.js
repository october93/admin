import React, { Component } from 'react'
import DangerZone from '../../components/DangerZone'
import './index.css'

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <DangerZone />
      </div>
    );
  }
}

export default Home;
