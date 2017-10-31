import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Link, Colors } from 'react-foundation'

import './style.scss'

@inject("store") @observer
class ReportBugPage extends Component {
  state = {
    issueSummary: "",
    issueDetail: "",
  }

  inputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  clear = () => {
    this.setState({
      issueSummary: "",
      issueDetail: "",
    })
  }

  submit = () => {
    this.props.store.reportBugRequest(this.state.issueSummary, this.state.issueDetail)
    this.clear()
  }

  render() {
    return (
      <div className="pageMargins">
        <label>Summary:</label>
        <input type="text" value={this.state.issueSummary} name="issueSummary" onChange={this.inputChange} required/>
          <label>Detail:</label>
        <input type="text" value={this.state.issueDetail} name="issueDetail"   onChange={this.inputChange} required />

        <Link color={Colors.SECONDARY} onClick={this.clear}>Clear</Link>
        <Link onClick={this.submit}>Submit Bug</Link>
      </div>
    );
  }
}

export default ReportBugPage;
