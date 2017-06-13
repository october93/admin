import React, { Component } from 'react'
import { Link } from 'react-foundation'
import { observer, inject } from 'mobx-react'
import ReactTable from 'react-table'
import { Button, Colors, Sizes, Label } from 'react-foundation';


import './style.scss';
import "react-table/react-table.css"

const userTableRow = (data) => (
  <tr>
    <td>{data.simID}</td>
    <td>{data.nodeID}</td>
    <td>{data.username}</td>
    <td>{data.character.summary}</td>
  </tr>
)

const columns = [{
  Header: 'Sim ID',
  accessor: 'simID' // String-based value accessors!
}, {
  Header: 'NodeID',
  accessor: 'nodeID',
  // Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
}, {
  //id: 'friendName', // Required because our accessor is not a string
  Header: 'Username',
  accessor: 'username',
}, {
  Header: "Character Summary", // Custom header components!
  accessor: 'character.summary'
}]


/*
<table className="hover">
  <thead>
    <tr>
      <th>Sim ID</th>
      <th>NodeID</th>
      <th>Username</th>
      <th>Character Summary</th>
    </tr>
    {usersTable}
  </thead>
  <tbody>
  </tbody>
</table>*/

@inject("store") @observer
class SimulatorPage extends Component {
  render() {
    const usersTable = this.props.store.simData.users.toJS().map(userTableRow)
    let simConnected = (<Label onClick={() => this.props.store.connectToSim()} color={Colors.ALERT}>No Sim Connected (Click to connect)</Label>)
    let simUserTable = null

    if (this.props.store.simulatorConnected) {
      simConnected = (<Label color={Colors.SUCCESS}>Simulator Connected</Label>)
    }
    return (
      <div>
        <div>
          {simConnected}
        </div>
        <Link disabled={!this.props.store.simulatorConnected} size={Sizes.SMALL} onClick={() => this.props.store.getSimulatorDataRequest()}>Query Sim</Link>
        <div>
          <ReactTable
           data={this.props.store.simData.users}
           columns={columns}
           defaultPageSize={10}
         />
        </div>

      </div>
    );
  }
}

export default SimulatorPage;
