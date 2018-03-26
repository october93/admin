import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { connect } from 'react-redux'
import glamorous from "glamorous"

import Graph from '../../components/Graph'
import TopEdges from '../../components/TopEdges'
import CardRank from '../../components/CardRank'
import VoteTable from '../../components/VoteTable'
import TextInput from '../../components/textinput'
import Error from '../../components/error'

import { queryGraph, queryGraphAndCards, filterUsers, connectUsers } from '../../store/actions/graphexplorer'

import { vw } from '../../utils/media'

import ConnectUsers from "./connect-users"

const Container = glamorous.div({
  flex: 1,
  display: "flex",

  [vw.lv0]: {
    flexDirection: "column",
  },

  [vw.lv14]: {
    flexDirection: "row",
  },
})

const GraphContainer = glamorous.div({
  [vw.lv0]: {
    flex: 2,
  },

  [vw.lv14]: {
    flex: 1,
  },
})

class GraphExplorer extends Component {
  state = {
    usersToConnectText: "",
    usernameFilter: "",
    filterArray: [],
  }
  componentDidMount() {
    this.props.queryGraphAndCards()
  }

  handleFilter = event => {
    this.setState({usernameFilter: event.target.value, filterArray: event.target.value.length <= 0 ? [] : (event.target.value || "").split(',')})
    this.props.dispatch(filterUsers(event.target.value))
  }

  connectUsers = async () => {
    const { usersToConnectText } = this.state
    if (usersToConnectText) {
      const users = usersToConnectText.split(",").map(u => u.trim())

      await this.props.connectUsers(users)
      await this.props.queryGraph()
    }
  }

  connectAllUsers = async () => {
    const users = Object.values(this.props.data.usersByID).map(v => v.username)

    await this.props.connectUsers(users)
    await this.props.queryGraph()
  }

  onChangeConnectUsers = event => {
    this.setState({ usersToConnectText: event.target.value })
  }

  render() {
    if (this.props.graphError !== null) {
      return <Error>{this.props.graphError.message}</Error>
    }
    if (this.props.cardsError !== null) {
      return <Error>{this.props.cardsError.message}</Error>
    }
    if (this.props.isGraphLoading || this.props.cardsAreLoading) {
      return <p>Loading…</p>
    }
    return (
      <Container>
        <div style={{flex: 2, overflowY: "scroll"}}>
          <ConnectUsers
            value={this.state.usersToConnectText}
            onChange={this.onChangeConnectUsers}
            connectUsers={this.connectUsers}
            connectAllUsers={this.connectAllUsers}
          />
          <TextInput
            label={"Filter"}
            value={this.state.usernameFilter}
            onChange={this.handleFilter}
            placeholder="paul,eugene,chris,…"
          />

        <Tabs style={{marginTop: "10px"}}>
            <TabList>
              <Tab>Attention Rank</Tab>
              <Tab>Card Rank</Tab>
              <Tab>Vote Table</Tab>
            </TabList>
            <TabPanel>
              <TopEdges data={this.props.data} filters={this.state.filterArray} />
            </TabPanel>
            <TabPanel>
              <CardRank
                usersByID={this.props.data.usersByID}
                users={this.props.data.graph.users}
                cards={this.props.cards}
              />
            </TabPanel>
            <TabPanel>
              <VoteTable
                usersByID={this.props.data.usersByID}
                users={this.props.data.graph.users}
                cards={this.props.cards}
              />
            </TabPanel>
          </Tabs>
        </div>
        <GraphContainer>
          <Graph
            usersByID={this.props.data.usersByID}
            graph={this.props.data.graph}
            followersByID={this.props.data.followersByID}
          />
        </GraphContainer>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.graphLoadingSuccess,
    cards: state.cardsLoadingSuccess,
    graphError: state.graphLoadingFailure,
    cardsError: state.cardsLoadingFailure,
    isGraphLoading: state.graphIsLoading,
    cardsLoading: state.cardsAreLoading,
    usernameFilter: state.filteredUsers
  }
}

const mapDispatchToProps = {
    queryGraph,
    queryGraphAndCards,
    connectUsers,
  }

export default connect(mapStateToProps, mapDispatchToProps)(GraphExplorer)
