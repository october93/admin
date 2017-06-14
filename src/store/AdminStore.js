import cookie from "react-cookie"
import { observable } from 'mobx';
import uuid from "uuid"
import AuthService from '../utils/AuthService'
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import gql from 'graphql-tag';
import SocketClient from "./SocketClient"

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

  @observable hnStatus = null

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

  simUserAnalysis = []
  @observable simUsers = []

  @observable simulatorConnected = false
  gdat = {
    nodes: [],
    edges: [],
  }

  @observable cohortAnalysisSummary = {}

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
            NodeData {
              nodeId
              displayname
            }
            EdgeData {
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

  //Get Users
  getUsersRequest(){
    const msg = { rpc: "getUsers" }
    this.engineClient.sendMsg(msg, this.getUsersResponse.bind(this))
  }

  getUsersResponse(error, data){
    this.usersData = data
  }

  getSessionsRequest() {
    this.client.query({
      query: gql`
        {
          sessions {
            id
            username
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

  hnStatusRequest(){
    const msg = { rpc: "hnStatus" }
    this.engineClient.sendMsg(msg, this.hnStatusResponse.bind(this))
  }

  hnStatusResponse(error, data){
    if(error === undefined && data.Running) {
      this.hnStatus = "up"
    } else {
      this.hnStatus = "down"
    }
  }

  changeHNStatusRequest(status){
    let msg = {}

    if (status === "up"){
      msg.rpc = "startHN"
    } else if (status === "down"){
      msg.rpc = "stopHN"
    }

    this.engineClient.sendMsg(msg, this.changeHNStatusResponse.bind(this))
    this.hnStatus = null
  }

  changeHNStatusResponse(error, data) {
    this.hnStatusRequest()
  }

  inviteRequest(inviter, invitee){
    const msg = { rpc: "invite", data: {inviter: inviter, invitee: invitee}}
    this.engineClient.sendMsg(msg, this.inviteResponse.bind(this))
    this.inviteStatus = "waiting"
  }

  inviteResponse(error, data){
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

    /*console.log(data)

    const perNode = data.message.pernoderesults

    this.cohortAnalysisSummary = data.message

    const newUsers = this.simData.users

    let simNameMap = {}

    for (var i = 0; i < newUsers.length; i++) {
      let userid = newUsers[i].nodeID
      simNameMap[userid] = i
    }

    console.log(simNameMap)

    for (var nID in perNode) {
      if (Object.prototype.hasOwnProperty.call(perNode, nID)) {
        console.log(`Attaching for ${nID}`)
        let userTableIndex = simNameMap[nID]
        let user = newUsers[userTableIndex]
        if (user) {
          user.analysis = perNode[nID]
          user.test = true
        }
      }
      if ({}.hasOwnProperty.call(perNode, nID)) {
        console.log(`Attaching for ${nID}`)
        let userTableIndex = simNameMap[nID]
        let user = newUsers[userTableIndex]
        if (user) {
          user.analysis = perNode[nID]
          user.test = true
        }
      }
    }

    this.simData.users = newUsers
    */
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
