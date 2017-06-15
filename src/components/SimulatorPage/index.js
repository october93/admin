import React, { Component } from 'react'
import { Link } from 'react-foundation'
import { observer, inject } from 'mobx-react'
import ReactTable from 'react-table'
import { Column, Row, Colors, Sizes, Label } from 'react-foundation';


import './style.scss';
import "react-table/react-table.css"

const columns = [{
  Header: 'Sim ID',
  accessor: 'simID'
}, {
  Header: 'NodeID',
  accessor: 'nodeID',
}, {
  Header: 'Username',
  accessor: 'username',
}, {
  Header: "Character Summary",
  accessor: 'character.summary'
}, {
  id: "success",
  Header: "Analysis Results",
  accessor: d => d.analysis.success === true ? "Success" : d.analysis.failurereason,
  show: true,
}]


@inject("store") @observer
class SimulatorPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      cohortSuccess: "",
      cohortNumber: "",
      cohortMass: "",
    }

    this.inputChange = this.inputChange.bind(this)
    this.onCohortAnalysisSubmit = this.onCohortAnalysisSubmit.bind(this)

  }

  onCohortAnalysisSubmit(event) {
    event.preventDefault()
    this.props.store.requestCohortAnalysis(parseFloat(this.state.cohortSuccess, 10), parseFloat(this.state.cohortNumber, 10), parseFloat(this.state.cohortMass, 10))
  }

  inputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    let simConnected = (<Label onClick={() => this.props.store.connectToSim()} color={Colors.ALERT}>No Sim Connected (Click to connect)</Label>)

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
          <form onSubmit={this.onCohortAnalysisSubmit}>
            <Row className="display">
              <Column small={1}>
                <input type="number" step="any" placeholder="Suc." name="cohortSuccess" onChange={this.inputChange} required/>
              </Column>
              <Column small={1}>
                <input type="number" step="any" placeholder="Num" name="cohortNumber" onChange={this.inputChange} required/>
              </Column>
              <Column small={1}>
                <input type="number" step="any" placeholder="Mass" name="cohortMass" onChange={this.inputChange} required/>
              </Column>
              <Column small={1}>
                <button disabled={!this.props.store.simulatorConnected} type="submit" className="button">Analyze</button>
              </Column>
            </Row>

          </form>
        </div>

        <div>
          <ReactTable
           data={this.props.store.simUsers}
           columns={columns}
           defaultPageSize={10}
         />
        </div>

      </div>
    );
  }
}

export default SimulatorPage;
