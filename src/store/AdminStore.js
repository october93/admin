import cookie from "react-cookie"
import { observable } from 'mobx';
import uuid from "uuid"
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import gql from 'graphql-tag';


const defaultServerURL = `${location.hostname === "localhost" ? location.hostname + ":8080" : location.hostname}`

const MSG_SUCCESS = "success"

class AdminStore {
  @observable importerStatus = ""
  @observable graphNodeData = []
  @observable graphEdgeData = []
  @observable graphLoaded = false
  @observable usersData = []

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



  serverURL
	socket
  queuedMessages
  requests

	constructor() {
		// setup SockJS
    let wsProtocol = 'ws:'
    if (location.protocol === 'https:') {
      wsProtocol = 'wss:'
    }
    this.serverURL = `${wsProtocol}//${defaultServerURL}`

		const sockURL = `${this.serverURL}/deck_endpoint/`
		this.socket = new WebSocket(sockURL)

    let graphQLEndpoint = `${location.origin}/graphql`
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      graphQLEndpoint = 'http://localhost:8080/graphql'
    }

    this.client = new ApolloClient({
      networkInterface: createNetworkInterface({
        uri: graphQLEndpoint
      }),
    })

		this.socket.onmessage = this.onSocketMessage.bind(this)
		this.socket.onopen = this.onSocketOpen.bind(this)
		this.socket.onclose = this.onSocketClose.bind(this)

    this.queuedMessages = []
    this.requests = {}
	}

	// Socket Code

	onSocketOpen() {
		this.socketConnected = true
    console.log("SocketConnected")

    this.emptyMessageQueue()
	}

	onSocketClose() {
		console.log("lost connection, reconnecting")
		this.socketConnected = false
		this.openSocket(`${this.serverURL}/deck_endpoint/`)
	}

	emptyMessageQueue() {
		if (this.socketConnected && this.queuedMessages.length > 0) {
			for (let i = 0; i < this.queuedMessages.length; i++) {
				this.socket.send(this.queuedMessages[i])
			}
			this.queuedMessages = []
		}
	}

	sendMsg(msg) {
    msg = JSON.stringify(msg)

		console.log(msg)
		if (this.socketConnected) {
			if (this.queuedMessages.length > 0) {
				this.emptyMessageQueue()
			}
			this.socket.send(msg)
		} else {
			this.queuedMessages.push(msg)
		}
	}

	openSocket(url) {
		this.socket = new WebSocket(url)
		this.socket.onclose = this.onSocketClose.bind(this)
		this.socket.onmessage = this.onSocketMessage.bind(this)
		this.socket.onopen = this.onSocketOpen.bind(this)
	}

	onSocketMessage(e) {
		const parsedMsg = JSON.parse(e.data)
		const msgData = parsedMsg.data
		const msgError = parsedMsg.error
    const ack = parsedMsg.ack

    const handler = this.getResponse(ack)
    handler(msgError, msgData)
  }

  //requst tracking

  registerRequest(handler){
    const id = uuid.v4()
    this.requests[id] = handler

    return id
  }

  getResponse(ack){
    const handler = this.requests[ack]
    this.requests[ack] = null

    return handler
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

    this.graphLoaded = true

    console.log(`${JSON.stringify(this.graphNodeData)}, ${JSON.stringify(this.graphEdgeData)}`)
  }

  //Get Users
  getUsersRequest(){
    const reqID = this.registerRequest(this.getUsersResponse.bind(this))

    const msg = { rpc: "getUsers", requestID: reqID }
    this.sendMsg(msg)
  }

  getUsersResponse(type, data){
    this.usersData = data
  }

  newUserRequest(email, username, displayname, password){
    const reqID = this.registerRequest(this.newUserResponse.bind(this))

    const msg = { rpc: "newUser", requestID: reqID, data: {email: email, username: username, displayName: displayname, password: password}}

    this.sendMsg(msg)
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
    const reqID = this.registerRequest(this.newCardResponse.bind(this))

    const msg = { rpc: "newCard", requestID: reqID, data: {nodeId: userid, postBody: body, postUrl: url, anonymous: anon, layoutdata: ld, replyID: replyid}}
    this.sendMsg(msg)
    this.newCardStatus = "waiting"
    this.newCardID = ""
  }

  newCardResponse(type, data) {
    if (type === MSG_SUCCESS){
      this.newCardStatus = "success"
      this.newCardID = data.cardid
      console.log(`asdfasdfasdf ${this.newCardID}`)
    } else {
      this.newCardStatus = "failure"
    }

  }

  hnStatusRequest(){
    const reqID = this.registerRequest(this.hnStatusResponse.bind(this))

    const msg = { rpc: "hnStatus", requestID: reqID }
    this.sendMsg(msg)
  }

  hnStatusResponse(type, data){
    if(type === MSG_SUCCESS && data.Running) {
      this.hnStatus = "up"
    } else {
      this.hnStatus = "down"
    }
  }

  changeHNStatusRequest(status){
    const reqID = this.registerRequest(this.changeHNStatusResponse.bind(this))
    let msg = {requestID: reqID}

    if (status === "up"){
      msg.cmd = "startHN"
    } else if (status === "down"){
      msg.cmd = "stopHN"
    }

    this.sendMsg(msg)
    this.hnStatus = null
  }

  changeHNStatusResponse(type, data) {
    this.hnStatusRequest()
  }

  inviteRequest(inviter, invitee){
    const reqID = this.registerRequest(this.inviteResponse.bind(this))

    const msg = { rpc: "invite", requestID: reqID, data: {inviter: inviter, invitee: invitee}}
    this.sendMsg(msg)
    this.inviteStatus = "waiting"
  }

  inviteResponse(type, data){
    if(type === MSG_SUCCESS) {
      this.inviteStatus = "success"
    } else {
      this.inviteStatus = "failure"
    }
  }

  getDemoRequest(){
    const reqID = this.registerRequest(this.getDemoResponse.bind(this))

    const msg = { rpc: "getDemoData", requestID: reqID }
    this.sendMsg(msg)
  }

  getDemoResponse(type, data){
    if(type === MSG_SUCCESS) {
      this.demoData = JSON.stringify(data.CardIDs)
    }
  }

  setDemoRequest(demoData) {
    const reqID = this.registerRequest(this.setDemoResponse.bind(this))

    const msg = { cmd: "setDemoData", requestID: reqID, cardids: JSON.parse(demoData)}
    this.sendMsg(msg)

    this.setDemoStatus = "waiting"
  }

  setDemoResponse(type, data) {
    if(type === MSG_SUCCESS) {
      this.setDemoStatus = "success"
    } else {
      this.setDemoStatus = "failure"
    }
  }

  sendCommandRequest(command){
    const reqID = this.registerRequest(this.sendCommandResponse.bind(this))

    const msg = JSON.parse(command)
    msg.requestID = reqID

    this.sendMsg(msg)
  }

  sendCommandResponse(type, data) {
    const dataString = JSON.stringify(data, null, 2)
    console.log(dataString)
    this.commandResponse = `Type: ${type}\nData:\n${dataString}`
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
