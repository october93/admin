import React, { Component } from 'react';
import classnames from 'classnames';
import { observer, inject } from 'mobx-react';
import {FaPowerOff, FaPlus}  from 'react-icons/lib/fa';
import { Link } from 'react-router'

import './style.scss';

@inject("store") @observer
export default class UsersPage extends Component {
  constructor(props){
    super(props)

    this.props.store.getUsersRequest()
  }
  render() {
    const { className, ...props } = this.props;
    const usersList = this.props.store.usersData.toJS().map((data) =>
      <tr>
        <td>{data.Username}</td>
        <td>{data.NodeID}</td>
        <td><FaPowerOff color={data.Active ? "#9E9" : "#AAA"}/></td>
      </tr>
    )

    return (
      <div className={classnames("UsersPage", className)}>
          <table className="hover">
            <thead>
              <tr>
                <th>Username</th>
                <th>NodeID</th>
                <th>Active</th>
              </tr>
              {usersList}
            </thead>
            <tbody>
            </tbody>
          </table>

          <Link to="/admin/newUser"><FaPlus color="#9E9"/></Link>
      </div>
    );
  }
}
