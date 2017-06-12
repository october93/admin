import React, { Component } from 'react';
import classnames from 'classnames';
import { observer, inject } from 'mobx-react';

import './style.scss';

@inject("store") @observer
export default class SessionsPage extends Component {

  constructor(props){
    super(props)
    this.props.store.getSessionsRequest()
  }

  render() {
    const { className } = this.props;
    const sessionsList = this.props.store.sessionsData.toJS().map((data) =>
      <tr>
        <td>{data.id}</td>
        <td>{data.username}</td>
      </tr>
    )

    return (
      <div className={classnames("SessionsPage", className)}>
          <table className="hover">
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Username</th>
              </tr>
              {sessionsList}
            </thead>
            <tbody>
            </tbody>
          </table>
      </div>
    );
  }
}
