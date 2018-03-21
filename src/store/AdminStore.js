import { observable } from 'mobx';
import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import gql from 'graphql-tag';
import SocketClient from "./SocketClient"

const defaultServerURL = `${location.hostname === "localhost" ? location.hostname + ":9000" : location.hostname}`

class AdminStore {
  @observable importerStatus = ""
  @observable graphNodeData = []
  @observable graphEdgeData = []
  @observable graphLoaded = false
  @observable usersData = []

  @observable session = null
  @observable loginError = null


  @observable invitesData = []
  @observable sessionsData = []

  //this is a weird way to do this, but I don't feel like figuring out a better way right now
  @observable newUserSuccess = null
  @observable newUserWaiting = false

  @observable newCardStatus = null

  @observable inviteStatus = null

  @observable updateSettingsStatus = null

  @observable demoData = ""
  @observable setDemoStatus = ""
  @observable newCardID = ""

  @observable commandResponse = ""

  @observable graphData = {}

  @observable simData = {
    users: [],
    cards: [],
  }

  @observable postRankings = []
  @observable likeRankings = []
  @observable hitRateRankings = []

  @observable totalPosts = 0
  @observable totalLikes = 0
  @observable totalHitrate = 0

  simUserAnalysis = []
  @observable simUsers = []

  @observable simulatorConnected = false
  gdat = {
    nodes: [],
    edges: [],
  }

  @observable cohortAnalysisSummary = {}

  @observable cardPreviewLayoutdata = null
  @observable cardPreviewFeedback = null

  @observable allCardsWithMetrics = []
  @observable cardHitRateMetricsData = []

  serverURL
  simulatorclient
  engineclient

  websocketURL
  graphqlURL


	constructor() {
		// setup SockJS
    let wsProtocol = 'ws:'
    if (location.protocol === 'https:') {
      wsProtocol = 'wss:'
    }
    this.serverURL = `${wsProtocol}//${defaultServerURL}`

    this.websocketURL = `${this.serverURL}/deck_endpoint/`
    this.engineClient = new SocketClient(this.websocketURL, true, (b) => this.socketConnected = b)


    this.graphqlURL = `${location.origin}/graphql`
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      this.graphqlURL = 'http://localhost:9000/graphql'
    }

    const httpLink = createHttpLink({
      uri: this.graphqlURL
    });

    const logoutLink = onError(({ networkError }) => {
      if (networkError.statusCode === 401) this.logout();
    })

    const authLink = setContext((_, { headers }) => {
      const session = JSON.parse(localStorage.getItem('session'));
      return {
        headers: {
          ...headers,
          Authorization: session.id,
        }
      }
    });

    this.client = new ApolloClient({
      link: authLink.concat(logoutLink.concat(httpLink)),
      cache: new InMemoryCache()
    })

    this.queuedMessages = []
    this.requests = {}

    const lastSunday = new Date()
    lastSunday.setDate(lastSunday.getDate() - lastSunday.getDay())
    const nextSunday = new Date()
    nextSunday.setDate(nextSunday.getDate() + 7 - nextSunday.getDay())
	}

  // server data requests

  // Graph Data
  getGraphData(){
    this.client.query({
      query: gql`
        {
          graph {
            users {
              nodeId
              displayname
            }
            edges {
              sourceID
              targetID
            }
          }
        }
      `,
    })
      .then(data => this.graphDataRecieved(data))
      .catch(error => console.error(error));
  }

  graphDataRecieved(data){
    const nodeData = data.data.graph.NodeData
    const edgeData = data.data.graph.EdgeData

    this.graphNodeData = []
    this.graphEdgeData = []

    for (let i = 0; i < nodeData.length; i++){
      const n = nodeData[i]
      const tmp = {id: n.nodeId, label: n.displayname}
      this.graphNodeData.push(tmp)
    }

    for (let i = 0; i < edgeData.length; i++){
      const n = edgeData[i]
      const tmp = {from: n.sourceID, to: n.targetID}
      this.graphEdgeData.push(tmp)
    }

    this.gdat = {
      nodes: this.graphNodeData.toJS(),
      edges: this.graphEdgeData.toJS(),
    }

    this.graphLoaded = true
  }

  getUsersData(from, to){
    if (typeof from !== "undefined") {
      this.dashboardFromTime = from
    }
    if (typeof to !== "undefined") {
      this.dashboardToTime = to
    }
    console.log(`(from:"${this.dashboardFromTime}", to:"${this.dashboardToTime}")`)


    this.client.query({
      query: gql`
        {
          users {
            username
            nodeId
            lastactiontime
            node {
              cardRankTableSize
            }
          }
        }
      `,
    })
      .then(data => this.userHealthDataRecieved(data))
      .catch(error => console.error(error));
  }

  userHealthDataRecieved(data){
    this.usersData = data.data.users
  }

  getSessionsRequest() {
    this.client.query({
      query: gql`
        {
          sessions {
            id
            username
            lastActivity
          }
        }
      `,
    }).then(data => { this.sessionsData = data.data.sessions })
      .catch(error => console.error(error));
  }

  getInvitesRequest() {
    this.client.query({
      query: gql`
        {
          invites {
            token
            issuer
            expires
            remainingUses
          }
        }
      `,
      fetchPolicy: 'network-only',
    }).then(data => this.invitesData = data.data.invites)
      .catch(error => console.error(error));
  }

  newInviteRequest(nodeID) {
    this.client.mutate({
      mutation: gql`
      mutation {
        newInvite(nodeID:"${nodeID}")
      }
      `,
    })
    .then(() => this.getInvitesRequest())
    .catch(error => console.error(error));
  }


  sendLoginRequest(username, password, token) {
    const msg = {rpc: "login", data: {username, password, token}}
    this.engineClient.sendMsg(msg, this.loginResponse.bind(this))
  }

  loginResponse(error, data) {
    if (error !== undefined || !data.user.admin) {
      this.loginError = error;
    } else {
      this.session = {id: data.session.id, username: data.user.displayname}
      localStorage.setItem("session", JSON.stringify(this.session))
      window.location.replace('/admin')
    }
  }

  sendPasswordResetRequest(email) {
    const msg = {rpc: "resetPassword", data: {email}}
    this.engineClient.sendMsg(msg, this.passwordResetResponse.bind(this))
  }

  passwordResetResponse(error, data) {
    window.location.replace('/admin/login')
  }

  updateSettings(password) {
    const msg = {rpc: "updateSettings", sessionID: this.session.id, data: {password}}
    this.engineClient.sendMsg(msg, this.updateSettingsResponse.bind(this))
  }

  updateSettingsResponse(error, data) {
    if (error === undefined) {
      this.updateSettingsStatus = 'success'
    }
  }

  loggedIn() {
    let session = localStorage.getItem("session")
    if (session !== undefined) {
      this.session = JSON.parse(session)
    }
    if (this.session === null) {
      return false
    }
    return true
  }

  logout() {
    this.session = null;
    localStorage.removeItem("session")
    window.location.replace('/admin/login')
  }
  sendCommandRequest(command){
    const msg = JSON.parse(command)

    this.engineClient.sendMsg(msg, this.sendCommandResponse.bind(this))
  }

  sendCommandResponse(error, data) {
    const dataString = JSON.stringify(data, null, 2)
    this.commandResponse = {
      string: `Error: ${error}\nData:\n${dataString}`,
      error,
      data,
    }
  }

}

export default new AdminStore()
