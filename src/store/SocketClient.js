import uuid from "uuid"

export default class SocketClient {
  autoconnect
  socketURL
  socket
  socketConnected = false
  queuedMessages = []
  requests = {}
  auth
  connectTimeout = 0
  conStatusChangeHandler

  constructor(url, auth, autoconnect, conStatusChangeHandler){
    this.autoconnect = autoconnect
    this.socketURL = url
    this.auth = auth
    this.conStatusChangeHandler = conStatusChangeHandler

    this.connect()
  }

  onSocketOpen() {
    console.log(`SocketConnected to ${this.socketURL}`)
    this.socketConnected = true
    this.conStatusChangeHandler(true)
    this.emptyMessageQueue()
  }

  onSocketClose() {
    console.log("Lost Connection.")
    this.socketConnected = false
    this.conStatusChangeHandler(false)

    if (this.autoconnect) {
      this.connectTimeout = setTimeout( this.connect.bind(this), 5000)
      //this.connect(this.socketURL)
    }
  }

  connect() {
    console.log(`Conecting to ${this.socketURL}.`)
    clearTimeout(this.connectTimeout)
		this.socket = new WebSocket(this.socketURL)
		this.socket.onclose = this.onSocketClose.bind(this)
		this.socket.onmessage = this.onSocketMessage.bind(this)
		this.socket.onopen = this.onSocketOpen.bind(this)
	}

  emptyMessageQueue() {
    if (this.socketConnected && this.queuedMessages.length > 0) {
      for (let i = 0; i < this.queuedMessages.length; i++) {
        this.socket.send(this.queuedMessages[i])
      }
      this.queuedMessages = []
    }
  }

  sendMsg(msg, responseHandler) {
    if (msg.sessionID === undefined) {
      msg.sessionID = this.auth.getToken()
    }

    var reqID = this.registerRequest(responseHandler)
    msg.requestID = reqID

    msg = JSON.stringify(msg)

    if (this.socketConnected) {
      if (this.queuedMessages.length > 0) {
        this.emptyMessageQueue()
      }
      this.socket.send(msg)
    } else {
      this.queuedMessages.push(msg)
    }
  }

  onSocketMessage(e) {
    const parsedMsg = JSON.parse(e.data)
    const msgData = parsedMsg.data
    const msgError = parsedMsg.error
    const ack = parsedMsg.ack

    const handler = this.getResponse(ack)
    handler(msgError, msgData)
  }

  registerRequest(handler) {
    const id = uuid.v4()
    this.requests[id] = handler

    return id
  }

  getResponse(ack){
    const handler = this.requests[ack]
    this.requests[ack] = null

    return handler
  }

}
