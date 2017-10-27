import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Column, Row  } from 'react-foundation'

import './style.scss'

@inject("store") @observer
class DashPage extends Component {
  state = {
    from: this.props.store.dashboardFromTime,
    to: this.props.store.dashboardToTime,
  }
  
  render() {
    return (
      <div>
        Welcome!
      </div>
    );
  }
}

export default DashPage;
