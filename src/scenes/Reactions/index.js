import React, { Component } from 'react';
import ReactTable from 'react-table'
import { connect } from 'react-redux'
import moment from 'moment'
import { Tooltip } from 'react-tippy'

import { getReactions } from '../../store/actions/reactions'
import commaFilter from '../../utils/comma-filter'
import Icon from '../../components/icon'
import CardLink from '../../components/CardLink'

import "react-table/react-table.css"

const toggleValueInArray = (array, value) => {
  const arr = array || []
  if (arr.includes(value)){
    return arr.filter(i => i !== value)
  }
  return [...arr, value]
}


const columns = [{
  Header: 'Username',
  accessor: 'username',
  filterable: true,
  filterMethod: commaFilter,
  width: 150,
}, {
  Header: 'CardID',
  accessor: 'cardID',
  filterable: true,
  Cell: props => <CardLink cardID={props.value} />
}, {
  Header: "Reaction",
  id: "reaction",
  accessor: d => d,
  Cell: props => (
    <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
      {props.value.reaction === "boost" ? (
        <Icon name="004_boost-outline" size={24} color={props.value.sentToGraph ? "#08B8FB" : "#AAA"} />
      ) : (
        <Icon name="032_dismiss-outline" size={24} color={props.value.sentToGraph ? "#FA5252" : "#AAA"} />
      )}
    </div>
  ),
  filterable: true,
  filterMethod: (filter, row) => {
    if (filter.value.includes(row[filter.id].reaction) && (!filter.value.includes("sentToGraph") || row[filter.id].sentToGraph)) {
      return true
    }
    return false
  },
  Filter: ({ filter, onChange }) => {
    const currentFilter = filter ? filter.value || [] : ["boost", "bury"]
    return (
      <div style={{display: "flex", margin: "0px 10px",flexDirection: "row", alignItems: "center", justifyContent: "space-around"}}>
        <div onClick={() => onChange(toggleValueInArray(currentFilter, "boost"))}>
          <Icon name="004_boost-outline" size={24} color={currentFilter.includes("boost") ? "#08B8FB" : "#AAA"} />
        </div>
        <div onClick={() => onChange(toggleValueInArray(currentFilter, "bury"))}>
          <Icon name="032_dismiss-outline" size={24} color={currentFilter.includes("bury") ? "#FA5252" : "#AAA"} />
        </div>
        <div style={{width: "50px"}}onClick={() => onChange(toggleValueInArray(currentFilter, "sentToGraph"))}>
          { currentFilter.includes("sentToGraph") ? "Graph" : "All" }
        </div>

      </div>
    )}
}, {
  Header: "Timestamp",
  accessor: 'updatedAt',
  Cell: props => {
    const t = moment(props.value)
    return props.value ?
      ( <Tooltip title={t.format("YY-MM-D HH:mm:ss")}>{t.fromNow()}</Tooltip> )
      : "Never"
  }
}]


class ReactionsPage extends Component {
  componentDidMount() {
    this.props.getReactions()
  }

  makeButtonColumn = () => {
    return
  }

  render() {
    return (
      <div style={{ width: "100%", margin: "10px"}}>
        <ReactTable
         data={this.props.reactions}
         columns={columns}
         defaultPageSize={100}
         minRows={0}
        />
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    reactions: state.reactions,
    reactionsLoading: state.reactionsLoading,
  }
}

const mapDispatchToProps = {
  getReactions,
}

export default connect(mapStateToProps, mapDispatchToProps)(ReactionsPage)
