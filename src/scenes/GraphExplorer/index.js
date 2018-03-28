import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { connect } from 'react-redux'
import glamorous from "glamorous"

import Error from '../../components/error'
import Button from '../../components/button'

import TopEdges from './top-edges'
import CardRank from './card-rank'
import VoteTable from './vote-table'
import Graph from './graph'

import { queryGraph, queryGraphAndCards, connectUsers } from '../../store/actions/graphexplorer'

import { vw } from '../../utils/media'

import ConnectUsers from "./connect-users"

const Container = glamorous.div({
  flex: 1,
  display: "flex",
  marginBottom: "20px",

  [vw.lv0]: {
    flexDirection: "column",
  },

  [vw.lv14]: {
    flexDirection: "row",
  },
})

const MetricsContainer = glamorous.div(({ showGraph }) => ({
  flex: 1,
  overflowY: "scroll"
}))

const GraphContainer = glamorous.div({
  flex: 1
})

class GraphExplorer extends Component {
  state = {
    usersToConnectText: "",
    usernameFilter: "",
    filterArray: [],
    showGraph: false,
  }

  componentDidMount() {
    this.props.queryGraphAndCards()
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
        <MetricsContainer>
        <Tabs style={{marginTop: "10px"}} forceRenderTabPanel={true}>
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
                cardRanks={this.props.allCardRankEntries}
              />
            </TabPanel>
            <TabPanel>
              <VoteTable
                users={this.props.data.graph.users}
                cardVotes={this.props.allVoteEntries}
              />
            </TabPanel>
          </Tabs>
        </MetricsContainer>
        { this.state.showGraph && (
          <GraphContainer>
            <ConnectUsers
              value={this.state.usersToConnectText}
              onChange={this.onChangeConnectUsers}
              connectUsers={this.connectUsers}
              connectAllUsers={this.connectAllUsers}
            />
            <Graph
              usersByID={this.props.data.usersByID}
              graph={this.props.data.graph}
              followersByID={this.props.data.followersByID}
            />
          </GraphContainer>
        )}
        <div style={{ position: "fixed", display: "flex", alignItems: "center", justifyContent: "center", padding: "10px", top: "0px", right: "0px", backgroundColor: "#AAA", borderBottomLeftRadius: "10px", width: "100px"}}>
          <Button onClick={() => this.setState({ showGraph: !this.state.showGraph })}>
            {this.state.showGraph ? "Hide Graph" : "Show Graph"}
          </Button>
        </div>
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
    usernameFilter: state.filteredUsers,
    allCardRankEntries: state.allCardRankEntries,
    allVoteEntries: state.allVoteEntries,
  }
}

const mapDispatchToProps = {
    queryGraph,
    queryGraphAndCards,
    connectUsers,
  }

export default connect(mapStateToProps, mapDispatchToProps)(GraphExplorer)
