import React, { Component } from 'react';
import ReactTable from 'react-table'
import { connect } from 'react-redux'

import { getInvites, newInvite, bulkCreateInvites, deactivateInvite } from '../../store/actions/invites'
import { getUsers } from '../../store/actions/users'
import Checkbox from "../../components/checkbox"
import Button from "../../components/button"

import { Group } from '@vx/group';
import { Cluster } from '@vx/hierarchy';
import { LinkVertical } from '@vx/shape';
import { hierarchy } from 'd3-hierarchy';

const raw = {
  "name": "T",
  "children": [{
    "name": "A",
    "children": [
      { "name": "A1" },
      { "name": "A2" },
      { "name": "C",
        "children": [{
          "name": "C1"
        }]},
    ]}, {
    "name": "B",
    "children": [
      { "name": "B1"},
      { "name": "B2"},
      { "name": "B3"},
    ]},{
      "name": "X",
      "children": [{
      "name": "Z"
    }]}
  ],
}

const Node = ({ node, events }) => {
  const width = 40;
  const height = 20;
  return (
    <Group top={node.y} left={node.x}>
      {node.depth === 0 &&
        <rect
          width={width}
          height={height}
          y={-height / 2}
          x={-width / 2}
          fill="url('#top')"
        />
      }
      {node.depth !== 0 &&
        <circle
          r={12}
          fill="#306c90"
          stroke={node.children ? "white" : "#ddf163"}
          onClick={() => {
            alert(`clicked: ${JSON.stringify(node.data.name)}`)
          }}
        />
      }
      <text
        dy={".33em"}
        fontSize={9}
        fontFamily="Arial"
        textAnchor={"middle"}
        style={{ pointerEvents: "none" }}
        fill={node.depth === 0 ? "#286875" : node.children ? "white" : "#ddf163"}
      >
        {node.data.name}
      </text>
    </Group>
  );
}

const Link = ({ link }) => {
  return (
    <LinkVertical
      data={link}
      stroke="#f7f7f3"
      strokeWidth="1"
      strokeOpacity={0.2}
      fill="none"
    />
  );
}

const TestTree = ({
  width,
  height,
  events = false,
  margin = {
    top: 40,
    left: 0,
    right: 0,
    bottom: 110,
  }
}) => {
  const data = hierarchy(raw);
  return (
    <svg width={width} height={height}>
      <rect
        width={width}
        height={height}
        rx={14}
        fill="#306c90"
      />
      <Cluster
        top={margin.top}
        left={margin.left}
        root={data}
        size={[
          width - margin.left - margin.right,
          height - margin.top - margin.bottom
        ]}
        nodeComponent={Node}
        linkComponent={Link}
      />
    </svg>
  );
}


class InvitesPage extends Component {
  componentDidMount() {
    this.props.getInvites()
    // this.props.getUsers()
  }

  columns = [{
    Header: "",
    width: 30,
    accessor: d => d,
    id: "remove",
    Cell: props => props.value.remainingUses > 0 ? <Button onClick={() => {this.removeInvite(props.value.id)}}>X</Button> : ""
  },{
    Header: 'Token',
    accessor: 'token',
    filterable: true,
  }, {
    Header: 'For User',
    accessor: 'issuer.username',
    filterable: true,
  }, {
    Header: 'Gives Invites',
    id: 'givesInvites',
    width: 100,
    accessor: d => d.givesInvites ? "Yes" : ""
  }, {
    Header: 'In Group',
    id: 'groupedWith',
    accessor: d => d.groupID ? this.props.invitesByGroupID[d.groupID].join(", ") : ""
  }]

  state = {
    bulkInvites: [],
    showUsed: false,
    showPaper: false,
  }

  handleBulkInvites = async (event) => {
    event.preventDefault()

    var nodeID = prompt("ID for Inviting Node (REQUIRED):")
    var count = prompt("How many? (Be careful this is permanent):")

    if (nodeID && count) {
      const bulkInvites = await this.props.bulkCreateInvites({nodeID, count})
      await this.props.getInvites()
      this.setState({ bulkInvites })
    }
  }

  removeInvite = (id) => {
    this.props.deactivateInvite(id)
  }

  getFilteredInvites = () => {
    const { showUsed, showPaper } = this.state
    return this.props.invites
      .filter(v => showUsed || v.remainingUses > 0)
      .filter(v => showPaper || !v.hideFromUser)
  }

  render() {
    const { showUsed, showPaper } = this.state
    return (
      <div style={{ width: "100%" }}>
        <Checkbox checked={showUsed} label="Show Used Invites" onChange={e => this.setState({ showUsed: e.target.checked })} />
        <Checkbox checked={showPaper} label="Show Paper Card Invites" onChange={e => this.setState({ showPaper: e.target.checked })} />

        <div style={{ width: "100%", margin: "10px"}}>
          <ReactTable
           data={this.getFilteredInvites()}
           columns={this.columns}
           defaultPageSize={50}
           minRows={0}
          />
        </div>

        { this.state.bulkInvites.length > 0 && <div>{JSON.stringify(this.state.bulkInvites)}</div>}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  invites: state.invites,
  invitesByGroupID: state.invitesByGroupID,
  inviteesByInviter: state.inviteesByInviter,
})

const mapDispatchToProps = {
  getInvites,
  newInvite,
  bulkCreateInvites,
  deactivateInvite,
  getUsers,
}

export default connect(mapStateToProps, mapDispatchToProps)(InvitesPage)
