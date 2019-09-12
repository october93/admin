import React, { Component } from 'react'
import ReactTable from "react-table";
import { connect } from 'react-redux'
import { getConnections } from '../../store/actions/whoisonline'
import timeago from 'timeago.js'
import UAParser from 'ua-parser-js'

class WhoIsOnline extends Component {
  columns() {
    return [{
      Header: 'Connected',
      accessor: 'createdAt',
      width: 250,
      Cell: row => (timeago().format(new Date(row.value))),
    }, {
      Header: 'User',
      accessor: 'session.user.username',
      width: 150,
    }, {
      Header: 'IP Address',
      accessor: 'ipAddress',
      width: 150,
    }, {
      Header: 'User Agent',
      accessor: 'userAgent',
      Cell: row => {
        const ua = new UAParser(row.value)
        const browser = ua.getBrowser()
        return ( `${browser.name} ${browser.version} on ${ua.getOS().name}` )
      },
    }]
  }

  componentDidMount() {
    this.props.getConnections()
  }

  render() {
    return (
      <div style={{ margin: "-10px", width: "100%", height: "100%" }}>
        <ReactTable
          getTdProps={(state, rowInfo, column) => {
            let style = {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }
            if (column.id === 'userAgent') {
              style.justifyContent = 'left'
            }
            return { style }
          }}
          style={{ height: "100%" }}
          columns={this.columns()}
          data={this.props.connections}
          className="-striped -highlight"
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
    connections: state.connections,
    error: state.connectionsFailed,
    isLoading: state.connectionsRequested,
})

const mapDispatchToProps = {
  getConnections,
}

export default connect(mapStateToProps, mapDispatchToProps)(WhoIsOnline)
