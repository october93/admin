import React, { Component } from 'react'
import { Link } from 'react-foundation'
import { observer, inject } from 'mobx-react'

import './style.scss';

@inject("store") @observer
class SimulatorPage extends Component {
  render() {
    return (
      <div>
        <div>
          <Link onClick={() => this.props.store.sendSimulatorCommandRequest("helloworld")}>Ping The Sim</Link>
        </div>
      </div>
    );
  }
}

export default SimulatorPage;
