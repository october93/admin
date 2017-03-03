import SockJS from "sockjs-client"


import { observable } from 'mobx';
import uuid from "uuid"


const serverURL = "http://localhost:8080"

class AdminStore {
  @observable importerStatus = ""
  @observable graphNodeData = []
  @observable graphEdgeData = []
  @observable graphLoaded = false

	socket
  queuedMessages
  requests

	constructor() {
		// setup SockJS
		const sockURL = `${serverURL}/deck_endpoint`
		this.socket = new SockJS(sockURL)


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
		this.openSocket(`${serverURL}/deck_endpoint`)
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
		this.socket = new SockJS(url)
		this.socket.onclose = this.onSocketClose.bind(this)
		this.socket.onmessage = this.onSocketMessage.bind(this)
		this.socket.onopen = this.onSocketOpen.bind(this)
	}

	onSocketMessage(e) {
		const parsedMsg = JSON.parse(e.data)
		const msgType = parsedMsg.msg
		const msgData = parsedMsg.data
    const ack = parsedMsg.ack

		//console.log(`SocketMsg: ${e.data}`)

    if(msgType === "success"){
      const handler = this.requests[ack]
      this.requests[ack] = null

      handler(msgData)
    }
  }

  //requst tracking

  registerRequest(id, handler){
    this.requests[id] = handler
  }

  // server data requests

  getGraphData(){
    console.log("getgraphdata")
    const reqID = uuid.v4()

    this.registerRequest(reqID, this.graphDataRecieved.bind(this))

    const msg = { cmd: "getGraph", requestID: reqID }
    this.sendMsg(JSON.stringify(msg))
  }

  getNodeData(nodeid){
    for(var i = 0; i< this.graphNodeData.length; i++){
      if(this.graphNodeData[i].id === nodeid){
        return this.graphNodeData[i]
      }
    }
  }

  graphDataRecieved(data){
    const nodeData = data.NodeData
    const edgeData = data.EdgeData

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

}

export default new AdminStore()
