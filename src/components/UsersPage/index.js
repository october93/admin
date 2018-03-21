import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import ReactTable from 'react-table'
import "react-table/react-table.css"

const msInDay = 86400000

const daysSince = (time) => {
  if (time === 0) {
    return -1
  } else {
    return (Math.floor((Date.now() - (time*1000)) / msInDay))
  }
}

const daysSinceString = (since) => {
  if (since === -1) {
    return "Never"
  } else if (since <= 1) {
    return "Today"
  }

  return `${daysSince(since)} day${since > 1 ? "s" : ""}`
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
  Cell: row => daysSinceString(daysSince(row.value))
}, {
  Header: 'Consumed',
  accessor: 'countGivenReacts',
}, {
  Header: "Unseen Cards",
  accessor: 'node.cardRankTableSize',
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
    return (
      <div style={{ width: "100%", margin: "10px"}}>
        <ReactTable

         data={this.props.store.usersData}
         columns={columns}
         defaultPageSize={20}
        />
      </div>
    );
  }
}
