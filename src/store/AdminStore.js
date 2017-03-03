import SockJS from "sockjs-client"


import { observable } from 'mobx';
import uuid from "uuid"


const serverURL = "ws://localhost:8080"

const MSG_SUCCESS = "success"
const MSG_FAIL = "failure"

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


	socket
  queuedMessages
  requests

	constructor() {
		// setup SockJS
		const sockURL = `${serverURL}/deck_endpoint/`
		this.socket = new WebSocket(sockURL)


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
		this.openSocket(`${serverURL}/deck_endpoint/`)
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
		const msgType = parsedMsg.msg
		const msgData = parsedMsg.data
    const ack = parsedMsg.ack

    const handler = this.getResponse(ack)
    handler(msgType, msgData)
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
    const reqID = this.registerRequest(this.graphDataRecieved.bind(this))

    const msg = { cmd: "getGraph", requestID: reqID }
    this.sendMsg(msg)
  }

  graphDataRecieved(type, data){
    const nodeData = data.NodeData
    const edgeData = data.EdgeData

    this.graphNodeData = []
    this.graphEdgeData = []

    for (let i = 0; i < nodeData.length; i++){
      const n = nodeData[i]
      const tmp = {id: n.id, label: n.name}
      this.graphNodeData.push(tmp)
    }

    for (let i = 0; i < edgeData.length; i++){
      const n = edgeData[i]
      const tmp = {from: n.sourceid, to: n.targetid}
      this.graphEdgeData.push(tmp)
    }

    this.graphLoaded = true

    console.log(`${JSON.stringify(this.graphNodeData)}, ${JSON.stringify(this.graphEdgeData)}`)
  }

  //Get Users
  getUsersRequest(){
    const reqID = this.registerRequest(this.getUsersResponse.bind(this))

    const msg = { cmd: "getUsers", requestID: reqID }
    this.sendMsg(msg)
  }

  getUsersResponse(type, data){
    this.usersData = data
  }

  newUserRequest(email, username, displayname, password){
    const reqID = this.registerRequest(this.newUserResponse.bind(this))

    const msg = { cmd: "newUser", email: email, username: username, displayName: displayname, password: password, requestID: reqID}

    this.sendMsg(msg)
    this.newUserWaiting = true
  }

  newUserResponse(type, data){
    if (type === MSG_SUCCESS){
      this.newUserSuccess = true
    } else if (type === MSG_FAIL) {
      this.newUserSuccess = false
    }
    this.newUserWaiting = false
  }

  newCardRequest(userid, body, url, anon, ld) {
    const reqID = this.registerRequest(this.newCardResponse.bind(this))

    const msg = { cmd: "newCard", requestID: reqID, nodeId: userid, postBody: body, postUrl: url, anonymous: anon, layoutdata: ld}
    this.sendMsg(msg)
    this.newCardStatus = "waiting"
  }

  newCardResponse(type, data) {
    if (type === MSG_SUCCESS){
      this.newCardStatus = "success"
    } else {
      this.newCardStatus = "failure"
    }
  }


  // misc helpers
  getNodeData(nodeid){
    for(var i = 0; i< this.graphNodeData.length; i++){
      if(this.graphNodeData[i].id === nodeid){
        return this.graphNodeData[i]
      }
    }
  }

}

export default new AdminStore()