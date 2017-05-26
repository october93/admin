import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import './style.scss';

@inject("store") @observer
class DashPage extends Component {
  render() {
    const profile = JSON.parse(localStorage.getItem("profile"))
    return (
        <div>
          Welcome {profile.given_name}
        </div>

    );
  }
}

export default DashPage;
