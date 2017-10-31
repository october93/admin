import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'

import './style.scss'

@inject("store") @observer
class DashPage extends Component {
  state = {
    from: this.props.store.dashboardFromTime,
    to: this.props.store.dashboardToTime,
  }

  render() {
    return (
      <div className="pageMargins">
        Welcome!
      </div>
    );
  }
}

export default DashPage;
