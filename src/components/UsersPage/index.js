import React, { Component } from 'react';
import classnames from 'classnames';
import { observer, inject } from 'mobx-react';
import { FaPlus }  from 'react-icons/lib/fa';
import { Link } from 'react-router'
import ReactTable from 'react-table'

import './style.scss';
import "react-table/react-table.css"


const cardsSize = (size) => {
  if (size <= 10) {
    return "tableBad"
  }

  if (size >= 30) {
    return "tableGood"
  }

  return "tableNeutral"
}

const msInDay = 86400000

const daysSinceString = (since) => {
  if (since === -1) {
    return "Never"
  } else if (since <= 1) {
    return "Today"
  }

  return `${Math.floor(since)} day${since > 1 ? "s" : ""}`
}

const daysSinceColor = (since) => {
  if (since === -1) {
    return "tableBad"
  } else if (since <= 3) {
    return "tableGood"
  } else if (since <= 10) {
    return "tableNeutral"
  }

  return "tableBad"
}

const daysSince = (time) => {
  if (time === 0) {
    return -1
  } else {
    return (Math.floor((Date.now() - (time*1000)) / msInDay))
  }
}

const columns = [{
  Header: 'Username',
  accessor: 'username',
  filterable: true,
}, {
  Header: 'NodeID',
  accessor: 'nodeId',
}, {
  id: "satisfaction",
  Header: 'Satisfaction',
  accessor: d => d.countGivenReacts > 0 ? d.countGivenLikes / d.countGivenReacts : 0,
  Cell: row => (Math.floor(row.value * 100) + "%")
}, {
  Header: 'Last Action',
  accessor: 'lastactiontime',
  Cell: row => (<span className={daysSinceColor(daysSince(row.value))}>{daysSinceString(daysSince(row.value))}</span>)
}, {
  Header: 'Consumed',
  accessor: 'countGivenReacts',
}, {
  Header: "Unseen Cards",
  accessor: 'node.cardRankTableSize',
  Cell: row => (<span className={cardsSize(row.value)}>{row.value}</span>)
}]



@inject("store") @observer
export default class UsersPage extends Component {
  state = {
    from: this.props.store.dashboardFromTime,
    to: this.props.store.dashboardToTime,
  }

  inputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  onBlur = () => {
    this.props.store.getUsersData(this.state.from, this.state.to)
  }

  render() {
    const { className } = this.props;

    return (
      <div className="pageMargins">
        <Link to="/admin/newUser"><FaPlus size={30} color="#9E9"/></Link>
        <ReactTable
         data={this.props.store.usersData}
         columns={columns}
         defaultPageSize={20}
        />
      </div>
    );
  }
}
