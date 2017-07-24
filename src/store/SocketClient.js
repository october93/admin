import uuid from "uuid"

export default class SocketClient {
  autoconnect
  socketURL
  socket
  socketConnected = false
  queuedMessages = []
  requests = {}

  //these are objects with a callback and an unsubscribe ID
  subscriptionHandlers = {}

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

  subscribeTo(callback, ...topics) {
    console.log("subscribing")
    let msg = {
      rpc :"subscribe",
      sessionID: this.auth.getToken(),
      "data": {
        "string": callback.name,
        "topics": topics,
      }
    }

    var reqID = this.registerRequest(this.subscribeToHandler.bind(this))

    msg.requestID = reqID

    msg = JSON.stringify(msg)

    //put in msg queue or send message
    if (this.socketConnected) {
      if (this.queuedMessages.length > 0) {
        this.emptyMessageQueue()
      }
      this.socket.send(msg)
    } else {
      this.queuedMessages.push(msg)
    }

    //register subscription handler (objects to someday deal with unsubscribes)
    this.subscriptionHandlers[reqID] = {
      handler: callback,
    }
  }

  subscribeToHandler(err, data) {
    // data is the ID to unsubscribe to
    //we need to add the unsubscribe ID here somehow, but I don't want to deal with that right now.
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
    console.log(e)
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
    let handler = this.requests[ack]
    this.requests[ack] = null

    if (handler === null || typeof (handler) === "undefined") {
      handler = this.subscriptionHandlers[ack].handler
    }

    return handler
  }

}