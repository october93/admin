import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { connect } from 'react-redux'
import glamorous from "glamorous"

import Error from '../../components/error'

import TopEdges from './top-edges'

import { queryGraph, queryGraphAndCards, connectUsers } from '../../store/actions/graphexplorer'

import { vw } from '../../utils/media'

import UserSelector from './UserSelector'
import CardRankTable from './CardRankTable';

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


class GraphExplorer extends Component {
  state = {
    usersToConnectText: "",
    usernameFilter: "",
    filterArray: [],
    showGraph: false,
    username: "root",
  }

  componentDidMount() {
    this.props.queryGraph([this.state.username])
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

  handleUserChange = selected => {
    const username = selected.value
    this.props.queryGraph([username])
    this.setState({ username: username })
  }

  render() {
    if (this.props.graphError !== null) {
      if (this.props.graphError.message.endsWith("graph is not available")) {
        return <div style={{display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: "bold", color:"#0009", width: "100%"}}>Graph not available for this environment.</div>
      }
      return <Error>{this.props.graphError.message}</Error>
    }
    let nested
    if (this.props.isGraphLoading) {
      nested = <p>Loading…</p>
    } else {
      nested = (
        <Tabs style={{marginTop: "10px"}} forceRenderTabPanel={true}>
        <TabList>
          <Tab>Attention Rank</Tab>
          <Tab>Card Rank</Tab>
        </TabList>
        <TabPanel>
          <TopEdges username={this.state.username} />
        </TabPanel>
        <TabPanel>
          <CardRankTable username={this.state.username} />
        </TabPanel>
      </Tabs>

      )
    }
    return (
      <Container>
        <MetricsContainer>
          <UserSelector onChange={this.handleUserChange} value={this.state.username} />
          {nested}
        </MetricsContainer>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    graphError: state.graphLoadingFailure,
    isGraphLoading: state.graphIsLoading,
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
