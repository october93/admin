import cookie from "react-cookie"
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

  getCardData(cardID){
    this.cardPreviewLayoutdata = null
    this.cardPreviewFeedback = null

    this.client.query({
      query: gql`
      {
      	card(card_id:"${cardID}") {
          layoutdata
          feedback {
            rating
            comment
          }
      	}
      }
      `,
    })
      .then(data => this.cardDataRecieved(data))
      .catch(error => console.error(error));
  }

  cardDataRecieved(data) {
    this.cardPreviewLayoutdata = data.data.card.layoutdata
    this.cardPreviewFeedback = data.data.card.feedback
    console.log(this.cardPreviewFeedback);
  }

  getCardsData(from, to){
    if (typeof from !== "undefined") {
      this.dashboardFromTime = from
    }
    if (typeof to !== "undefined") {
      this.dashboardToTime = to
    }
  this.client.query({
    query: gql`
    {
    	cards(from:"${this.dashboardFromTime}", to:"${this.dashboardToTime}") {
    	  cardID
    	  post_timestamp
    	  total_likes
    	  total_reacts
        layoutdata
        feedback {
          rating
          comment
        }
    	}
    }
    `,
  })
    .then(data => this.cardsDataRecieved(data))
    .catch(error => console.error(error));
  }

  cardsDataRecieved(data) {
    this.allCardsWithMetrics = data.data.cards

    let z = new Array(101)

    for (let i = 0; i <= 100; i++) {
      z[i] = {hitRate: i, number: 0}
    }

    for (let i = 0; i < this.allCardsWithMetrics.length; i++) {
      const d = this.allCardsWithMetrics[i]
      const hr = d.total_reacts > 0 ? Math.floor(d.total_likes / d.total_reacts * 100) : 0
      z[hr] = { hitRate: hr, number: z[hr].number + 1}
    }

    this.cardHitRateMetricsData = z
    console.log(this.cardHitRateMetricsData.toJS())
  }

  getDashboardMetrics(from, to){
    if (typeof from !== "undefined") {
      this.dashboardFromTime = from
    }
    if (typeof to !== "undefined") {
      this.dashboardToTime = to
    }

    this.client.query({
      query: gql`
      {
        graph {
          users {
            username
            displayname
          }
        }
      }
      `,
    })
      .then(data => this.dashboardMetricsRecieved(data))
      .catch(error => console.error(error));
  }

  dashboardMetricsRecieved(data){
    const users = data.data.graph.users
    let totalReacts = 0

    this.totalPosts = 0
    this.totalLikes = 0
    this.postRankings = []
    this.likeRankings = []
    this.hitRateRankings = []

    for(let i = 0; i < users.length; i++) {
      const usr = users[i]
      this.postRankings.push({name: usr.displayname, metric: usr.postsThisWeek})
      this.likeRankings.push({name: usr.displayname, metric: usr.likesThisWeek})
      let hr = usr.likesThisWeek / usr.reactionsThisWeek
      this.hitRateRankings.push({name: usr.displayname, metric: usr.reactionsThisWeek > 0 ? hr : 0 })

      this.totalPosts += usr.postsThisWeek
      this.totalLikes += usr.likesThisWeek
      totalReacts += usr.reactionsThisWeek
    }

    const sortFn = (a, b) => {
      if (a.metric > b.metric) {
        return -1
      } else if (a.metric < b.metric) {
        return 1
      }
      return 0
    }

    this.postRankings = this.postRankings.toJS().sort(sortFn)
    this.likeRankings = this.likeRankings.toJS().sort(sortFn)
    this.hitRateRankings = this.hitRateRankings.toJS().sort(sortFn)
    this.totalHitrate = totalReacts > 0 ? this.totalLikes / totalReacts : 0
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

  newUserRequest(email, username, displayname, password){
    this.client.mutate({
      mutation: gql`
      mutation {
        newUser(username:"${username}", email:"${email}", password: "${password}", displayname: "${displayname}")
      }
      `,
    })
    .then(data => this.newUserResponse(data))
    .catch(error => console.error(error));

    this.newUserWaiting = true
  }

  reportBugRequest(summary, description){
    const msg = { rpc: "reportBug", data: { source: "admin", summary, description }}

    this.engineClient.sendMsg(msg, this.reportBugResponse.bind(this))
    this.newUserWaiting = true
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

  reportBugResponse(error, data){
  }

  newUserResponse = (data) => {
    if (!data.error){
      this.newUserSuccess = true
    } else {
      this.newUserSuccess = false
    }
    this.newUserWaiting = false
  }

  connectUsersRequest(users){
    this.inviteStatus = "waiting"
    this.client.mutate({
      mutation: gql`
      mutation {
        connectUsers(usernames:${users})
      }
      `,
    })
    .then(data => this.inviteStatus = "success")
    .catch(error => {
      console.error(error)
      this.inviteStatus = "failure"
    });
  }

  connectAllUsersRequest(){
    let followersArray = []

    for (let i = 0; i < this.usersData.length; i++) {
      followersArray.push(this.usersData[i].username)
    }

    this.inviteStatus = "waiting"
    this.client.mutate({
      mutation: gql`
      mutation {
        connectUsers(usernames:${JSON.stringify(followersArray)})
      }
      `,
    })
    .then(data => this.inviteStatus = "success")
    .catch(error => {
      console.error(error)
      this.inviteStatus = "failure"
    });
  }



  getDemoRequest(){
    this.client.query({
      query: gql`
        {
          demoHand
        }
      `,
    })
      .then(data => this.getDemoResponse(data))
      .catch(error => console.error(error));
  }

  getDemoResponse(data){
    if (!data.error) {
      this.demoData = JSON.stringify(data.data.demoHand)
    }
  }

  setDemoRequest(demoData) {
    this.client.mutate({
      mutation: gql`
      mutation {
        setDemo(cards:${demoData})
      }
      `,
    })
    .then(data => this.setDemoResponse(data))
    .catch(error => console.error(error));

    this.setDemoStatus = "waiting"
  }

  setDemoResponse = (data) => {
    if (data.error === undefined) {
      this.setDemoStatus = "success"
    } else {
      this.setDemoStatus = "failure"
    }
  }

  sendCommandRequest(command){
    const msg = JSON.parse(command)

    this.engineClient.sendMsg(msg, this.sendCommandResponse.bind(this))
  }

  sendCommandResponse(error, data) {
    const dataString = JSON.stringify(data, null, 2)
    console.log(dataString)
    this.commandResponse = `Error: ${error}\nData:\n${dataString}`
  }

  // misc helpers
  getNodeData(nodeid){
    for(var i = 0; i< this.graphNodeData.length; i++){
      if(this.graphNodeData[i].id === nodeid){
        return this.graphNodeData[i]
      }
    }
  }

  changeEndpoint(end){
    this.serverURL = end
    cookie.save('serverurl', end, { path: '/' });
    this.openSocket(`${this.serverURL}/deck_endpoint/`)
  }

}

export default new AdminStore()
