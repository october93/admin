import React, { Component } from 'react'
import { Link } from 'react-foundation'
import { observer, inject } from 'mobx-react'

import './style.scss';

@inject("store") @observer
class DashPage extends Component {
  render() {
    const profile = JSON.parse(localStorage.getItem("profile"))
    const auth = this.props.store.auth
    return (
      <div>
        <div>
          Welcome {profile ? profile.given_name : null}
        </div>
        <div>
          <Link onClick={auth.logout.bind(this)}>Logout</Link>
        </div>
      </div>
    );
  }
}

export default DashPage;
