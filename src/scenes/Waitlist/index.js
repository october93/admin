import React, { Component } from 'react'
import ReactTable from "react-table";
import { connect } from 'react-redux'
import { getWaitlist, updateWaitlist } from '../../store/actions/waitlist'

class Waitlist extends Component {
  renderEditable = (cellInfo) => {
    return (
      <div
        style={{
          height: "100%",
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '10px',
        }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const email = cellInfo.original.email
          const comment = e.target.textContent
          this.props.updateWaitlist(email, comment)
        }}
        >{cellInfo.value}</div>
    )
  }

  columns() {
    return [{
      Header: 'Added',
      accessor: 'createdAt',
      width: 250,
      Cell: row => (new Date(row.value).toLocaleString()),
    }, {
      Header: 'Email',
      accessor: 'email',
      width: 300,
    }, {
      Header: 'Name',
      accessor: 'name',
      width: 300,
    }, {
      Header: 'Comment',
      accessor: 'comment',
      Cell: this.renderEditable,
    }]
  }

  componentDidMount() {
    this.props.getWaitlist()
  }

  render() {
    if (this.props.error !== null) {
      return "Error, see console."
    }
    if (this.props.isLoading) {
      return "Loading…"
    }
    return (
      <div style={{ margin: "-10px", width: "100%", height: "100%" }}>
        <ReactTable
          getTdProps={(state, rowInfo, column) => {
            let style = {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '37px'
            }
            if (column.id === 'comment') {
              style.padding = 0
            }
            return { style }
          }}
          style={{ height: "100%" }}
          columns={this.columns()}
          data={this.props.waitlist}
          className="-striped -highlight"
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
    waitlist: state.waitlist,
    error: state.waitlistFailed,
    isLoading: state.waitlistRequested,
})

const mapDispatchToProps = {
  getWaitlist,
  updateWaitlist,
}

export default connect(mapStateToProps, mapDispatchToProps)(Waitlist)
