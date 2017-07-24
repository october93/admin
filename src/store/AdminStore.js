import cookie from "react-cookie"
import { observable } from 'mobx';
import AuthService from '../utils/AuthService'
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import gql from 'graphql-tag';
import SocketClient from "./SocketClient"
import dateFormat from 'dateformat'

const defaultServerURL = `${location.hostname === "localhost" ? location.hostname + ":8080" : location.hostname}`

const defaultSimulatorSocketURL = "localhost:8083"

class AdminStore {
  @observable importerStatus = ""
  @observable graphNodeData = []
  @observable graphEdgeData = []
  @observable graphLoaded = false
  @observable usersData = []
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


	constructor() {
		// setup SockJS
    let wsProtocol = 'ws:'
    if (location.protocol === 'https:') {
      wsProtocol = 'wss:'
    }
    this.serverURL = `${wsProtocol}//${defaultServerURL}`

    this.auth = new AuthService('nKlyaG5r1Hh6TWsumqjJ5Z7vY5d0NZpl', 'october93.auth0.com')

    const sockURL = `${this.serverURL}/deck_endpoint/`
    this.engineClient = new SocketClient(sockURL, this.auth, true, (b) => this.socketConnected = b)


    let graphQLEndpoint = `${location.origin}/graphql`
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      graphQLEndpoint = 'http://localhost:8080/graphql'
    }

    this.client = new ApolloClient({
      networkInterface: createNetworkInterface({
        uri: graphQLEndpoint
      }),
    })

    this.queuedMessages = []
    this.requests = {}

    this.simulatorClient = new SocketClient(`${wsProtocol}//${defaultSimulatorSocketURL}`, this.auth, false, (b) => this.simulatorConnected = b)


    this.engineClient.subscribeTo(this.cohortAnalysisHandler.bind(this), "cohortAnalysis")
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

    //console.log(`${JSON.stringify(this.graphNodeData)}, ${JSON.stringify(this.graphEdgeData)}`)
  }

  getCardData(cardID){
    this.layoutDataCardPreview = null
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
  }

  getCardsData(){

  this.client.query({
    query: gql`
    {
    	cards {
    	  cardID
    	  post_timestamp
    	  total_likes
    	  total_reacts
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
    if (typeof from === "undefined") {
      const lastSunday = new Date()
      lastSunday.setDate(lastSunday.getDate() - lastSunday.getDay())
      from = dateFormat(lastSunday, "yyyy-mm-dd")
    }
    if (typeof to === "undefined") {
      const nextSunday = new Date()
      nextSunday.setDate(nextSunday.getDate() + 7 - nextSunday.getDay())
      to = dateFormat(nextSunday, "yyyy-mm-dd")
    }
    this.client.query({
      query: gql`
      {
        graph {
          users {
            username
            displayname
            likesThisWeek(from:"${from}", to:"${to}")
            postsThisWeek(from:"${from}", to:"${to}")
            reactionsThisWeek(from:"${from}", to:"${to}")
            countGivenReacts
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

  getUsersData(data){
    this.client.query({
      query: gql`
        {
          users {
            username
            nodeId
            lastactiontime
            countGivenLikes
            countGivenReacts
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

  newUserRequest(email, username, displayname, password){
    const msg = { rpc: "newUser", data: {email: email, username: username, displayName: displayname, password: password}}

    this.engineClient.sendMsg(msg, this.newUserResponse.bind(this))
    this.newUserWaiting = true
  }

  newUserResponse(error, data){
    if (error === undefined){
      this.newUserSuccess = true
    } else {
      this.newUserSuccess = false
    }
    this.newUserWaiting = false
  }

  newCardRequest(userid, body, url, anon, ld, replyid) {
    const msg = { rpc: "newCard", data: {nodeId: userid, postBody: body, postUrl: url, anonymous: anon, layoutdata: ld, replyID: replyid}}
    this.engineClient.sendMsg(msg, this.newCardResponse.bind(this))
    this.newCardStatus = "waiting"
    this.newCardID = ""
  }

  newCardResponse(error, data) {
    if (error === undefined){
      this.newCardStatus = "success"
      this.newCardID = data.cardid
      console.log(`asdfasdfasdf ${this.newCardID}`)
    } else {
      this.newCardStatus = "failure"
    }

  }

  inviteRequest(users){
    const followersArray = JSON.parse(users)

    this.inviteStatus = "waiting"
    const msg = { rpc: "connectUsers", data: {users: followersArray}}
    this.engineClient.sendMsg(msg, this.inviteResponse.bind(this))
  }

  inviteResponse(error, data){
    if (error === undefined) {
      this.inviteStatus = "success"
    } else {
      this.inviteStatus = "failure"
    }
  }

  connectAllUsersRequest(){
    let followersArray = []

    for (let i = 0; i < this.usersData.length; i++) {
      followersArray.push(this.usersData[i].username)
    }

    this.inviteStatus = "waiting"
    const msg = { rpc: "connectUsers", data: {users: followersArray}}
    this.engineClient.sendMsg(msg, this.connectAllResponse.bind(this))
  }

  connectAllResponse(error, data){
    if (error === undefined) {
      this.inviteStatus = "success"
    } else {
      this.inviteStatus = "failure"
    }
  }

  getDemoRequest(){
    const msg = { rpc: "getDemoCards" }
    this.engineClient.sendMsg(msg, this.getDemoResponse.bind(this))
  }

  getDemoResponse(error, data){
    if (error === undefined) {
      this.demoData = JSON.stringify(data.CardIDs)
    }
  }

  setDemoRequest(demoData) {
    const msg = { rpc: "setDemoCards", data: {cardids: JSON.parse(demoData)} }
    this.engineClient.sendMsg(msg, this.setDemoResponse.bind(this))

    this.setDemoStatus = "waiting"
  }

  setDemoResponse(error, data) {
    if (error === undefined) {
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

  sendSimulatorCommandRequest(cmd){
    var msg = { cmd }
    this.simulatorClient.sendMsg(msg, this.simulatorCommandResponseHandler.bind(this))
  }

  simulatorCommandResponseHandler(err, data) {
    console.log(data)
  }

  getSimulatorDataRequest() {
    var msg = { cmd: "dump" }
    this.simulatorClient.sendMsg(msg, this.simulatorDataResponseHandler.bind(this))
  }

  connectToSim() {
    this.simulatorClient.connect()
  }

  simulatorDataResponseHandler(err, data) {
    this.simUsers = this.mergeCohortAnalytics(data.users)


    console.log(this.simUsers.toJS())
  }

  requestCohortAnalysis(success, number, mass) {
    var msg = {
      rpc: "publish",
      data: {
        topic: "analyzeCohorts",
        message: {
          RequiredNodeSuccess: success,
          RequiredMemberNumber: number,
          RequiredCohortMass: mass,
        }
      }
    }

    this.engineClient.sendMsg(msg, () => null)
  }

  mergeCohortAnalytics(users) {
    for (var i = 0; i < users.length; i++) {
      let userid = users[i].nodeID

      if (typeof (this.simUserAnalysis[userid]) !== "undefined") {
        users[i].analysis = this.simUserAnalysis[userid]
      } else {
        users[i].analysis = {}
      }
    }

    return users
  }

  cohortAnalysisHandler(err, data) {
    this.simUserAnalysis = JSON.parse(JSON.stringify(data.message.pernoderesults))

    this.cohortAnalysisSummary = data.message
    this.cohortAnalysisSummary.pernoderesults = null

    this.getSimulatorDataRequest()
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
