import uuid from "uuid"

const TIMEOUT = 60000
/**
 * Provides a closed-box interface to the October Engine. This should be used exclusively by stores to interface with the Engine, not views.
 * @public
 */

const uuidRegExp = /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/ig

// Lower-case all UUIDs
// UUIDs should always be sent to us this way but sometimes they aren't
// and inconsistencies cause huge issues, so this is for security
const parseMsg = (raw) => {
	let parsed = raw

	const matches = uuidRegExp.exec(raw)

	if (matches) {
		matches.forEach((match) => { parsed = parsed.replace(new RegExp(match, "g"), match.toLowerCase()) })
	}

	return JSON.parse(parsed)
}

export default class APIClient {

	instance = null
	socket = null
	demoMode = false

	queuedMessages = []
	socketConnected = false
	onSocketOpenFn = null

	/**
	 * Map of ACKs to response message handlers, see {@link sendMessage}
	 * @private
	 * @type {Object}
	 */
	requests = {}

	authToken = null
	pendingAuthRequest = null

	constructor({
		webSocketHost,
		onServerReady,
		onSessionInvalid,
		requestTimeout,
		rpcHandlers,
	}) {
		this.webSocketHost = webSocketHost
		this.onSocketOpenFn = onServerReady
		this.onSessionInvalid = onSessionInvalid
		this.rpcHandlers = rpcHandlers
		this.timeout = requestTimeout || TIMEOUT
		this.openSocket()
	}

	setDemoMode(demo) {
		this.demoMode = demo
	}

	/**
	 * Instantiates APIClient class
	 * @static
	 * @param {string} webSocketHost WebSocket host URL
	 * */
	static init({
		webSocketHost,
		onServerReady,
		onSessionInvalid,
		requestTimeout,
		rpcHandlers,
	}) {
		this.instance = new APIClient({
			webSocketHost,
			onServerReady,
			onSessionInvalid,
			requestTimeout,
			rpcHandlers,
		})
	}

	/**
	 * Returns APIClient instance
	 * @static
	 * @return {instanceof APIClient} Returns if API is ready.
	 */
	static getInstance() {
		return this.instance
	}

	/*
	* Timeout helper
	* */
	timeoutHelper = (requestPromise, timeout) =>
		Promise.race([
			requestPromise,
			new Promise((_, reject) => {
				setTimeout(() => {
					reject(new Error("Request time out"))
				}, timeout || this.timeout)
			}),
		])

	/**
	 * Returns if the socket is connected and auth information is present.
	 * @public
	 * @return {boolean} Returns if API is ready.
	 */
	ready = () => this.socketConnected

	/**
	 * Authenticates with server and registers handler for return. Separate from "sendMessage" so we're not bound to the specific socket message format for auth.
	 * @public
	 * @param {string} username Username to authenticate with
	 * @param {string} password Password to authenticate with
	 * @param {function} handler Handler for server response
	 */
	authenticate = (username, password, handler) => {
		const requestID = this.registerRequest(handler)
		const msg = { rpc: "login", requestID, data: { username, password } }

		if (this.socketConnected) {
			this.socket.send(JSON.stringify(msg))
		} else {
			this.pendingAuthRequest = msg
		}
	}
	/**
	 * Promisified authenication
	 * @public
	 * */
	authenticateWithPromise = (username, password) =>
		this.timeoutHelper(
			new Promise((resolve, reject) => {
				this.authenticate(
					username,
					password,
					this.requestHandler(resolve, reject),
				)
			}),
		)

	/**
	 * Authenticates with server and registers handler for return. Separate from "sendMessage" so we're not bound to the specific socket message format for auth.
	 * @public
	 * @param {string} username Username to authenticate with
	 * @param {string} password Password to authenticate with
	 * @param {function} handler Handler for server response
	 */
	tokenAuthenticate = (accessToken, handler) => {
		const requestID = this.registerRequest(handler)
		const msg = { rpc: "login", requestID, data: { accessToken } }

		if (this.socketConnected) {
			this.socket.send(JSON.stringify(msg))
		} else {
			this.pendingAuthRequest = msg
		}
	}
	/**
	 * Promisified authenication
	 * @public
	 * */
	tokenAuthenticateWithPromise = accessToken =>
		this.timeoutHelper(
			new Promise((resolve, reject) => {
				this.tokenAuthenticate(
					accessToken,
					this.requestHandler(resolve, reject),
				)
			}),
		)

	/**
	 * Authenticates with server and registers handler for return. Separate from "sendMessage" so we're not bound to the specific socket message format for auth.
	 * @public
	 * @param {string} username Username to authenticate with
	 * @param {string} password Password to authenticate with
	 * @param {function} handler Handler for server response
	 */
	resetTokenAuthenticate = (token, handler) => {
		const requestID = this.registerRequest(handler)
		const msg = { rpc: "login", requestID, data: { token } }

		if (this.socketConnected) {
			this.socket.send(JSON.stringify(msg))
		} else {
			this.pendingAuthRequest = msg
		}
	}
	/**
	 * Promisified authenication
	 * @public
	 * */
	resetTokenAuthenticateWithPromise = accessToken =>
		this.timeoutHelper(
			new Promise((resolve, reject) => {
				this.resetTokenAuthenticate(
					accessToken,
					this.requestHandler(resolve, reject),
				)
			}),
		)

	/**
	 * Sends a message to the server. Registers a response handler and attaches auth info. Empties the messageQueue if necessary and sends the message if connected, adds message to messageQueue if not.
	 * @public
	 * @param {Object} msg The message to send (unserialized)
	 * @param {function} handler Handler for server response
	 */
	sendMessage = (msg, handler) => {
		const reqID = this.registerRequest(handler)

		const sendMsg = this.addAuth(msg)
		sendMsg.requestID = reqID

		const msgString = JSON.stringify(sendMsg)

		if (this.ready()) {
			this.socket.send(msgString)
		} else {
			this.queuedMessages.push(sendMsg)
		}
	}

	/**
	 * Helper for RPCRequest
	 * @private
	 * @param {function} resolve
	 * @param {function} reject
	 */
	requestHandler = (resolve, reject) => (error, data) => {
		if (error) {
			if (error.message === "invalid session" && this.onSessionInvalid) {
				this.onSessionInvalid()
			}
			reject(error)
		} else {
			resolve(data)
		}
	}

	/**
	 * Sends a message to the server.
	 * @public
	 * @param {Object} msg The message to send (unserialized)
	 * @return {Promise}
	 */
	RPCRequest = (msg, timeout) =>
		this.timeoutHelper(
			new Promise((resolve, reject) => {
				/*
			if (this.demoMode) {
				const resp = processDemoRequest(msg)

				if (resp != null) {
					resolve(resp)
				}
			}
			*/

				this.sendMessage(msg, this.requestHandler(resolve, reject))
			}),
			timeout,
		)

	/**
	 * Creates a new socket connection and binds handlers to it.
	 * @private
	 */
	openSocket = () => {
		this.socket = new WebSocket(this.webSocketHost)

		this.socket.onclose = this.onSocketClose
		this.socket.onmessage = this.onSocketMessage
		this.socket.onopen = this.onSocketOpen
	}

	/**
	 * Handles incoming messages from socket connection (from engine server). Parses message, fetches handler for message by ACK and runs handler.
	 * @private
	 * @param {Object} e Recieved message event from socket
	 * @param {Object} e.data Data payload from socket
	 */
	onSocketMessage = (e) => {
		const parsedMsg = parseMsg(e.data)
		console.log(parsedMsg)
		const responseHandler = this.getResponse(parsedMsg)
		if (responseHandler != null) {
			const error = parsedMsg.error && { message: parsedMsg.error }
			responseHandler(error, parsedMsg)
		}
	}

	/**
	 * Runs when a new socket connection is opened. Updates socket status, runs any pending authentication requests, then custom logic (if any).
	 * @private
	 */
	onSocketOpen = () => {
		this.socketConnected = true

		if (this.pendingAuthRequest) {
			this.socket.send(JSON.stringify(this.pendingAuthRequest))
			this.pendingAuthRequest = null
		}

		if (this.onSocketOpenFn) {
			this.onSocketOpenFn()
		}

		this.emptyMessageQueue()
	}

	/**
	 * Runs when socket closes for any reason. Updates socket status and attemps to reconnect.
	 * @private
	 */
	onSocketClose = () => {
		this.socketConnected = false
		this.openSocket()
	}

	/**
	 * Sends all queued messages to server in order. Adds auth info if missing before sending.
	 * @private
	 */
	emptyMessageQueue = () => {
		this.queuedMessages.forEach((msg) => {
			const sendMessage = this.addAuth(msg)
			const msgString = JSON.stringify(sendMessage)
			this.socket.send(msgString)
		})
		this.queuedMessages = []
	}

	/**
	 * Returns a new message with auth info attached (currently just adds nodeID, added in anticipation of better auth)
	 * @private
	 * @param {Object} msg Message to add auth to
	 * @return {Object} Message with auth info added
	 */
	addAuth = (msg) => {
		const newMsg = { ...msg }
		if (this.authToken) {
			newMsg.sessionID = this.authToken
		}

		return newMsg
	}

	/**
	 *	Generates an ACK and registers a handler to it
	 * @private
	 * @param {function} handler Handler to register
	 * @return {string} The ACK generated for the handler
	 */
	registerRequest = (handler) => {
		const id = uuid.v4()
		this.requests[id] = handler

		return id
	}

	/**
	 * Gets a response message's handler by ACK
	 * @private
	 * @param {string} ack The response message's ACK
	 * @return {fuction} The handler function for the given ACK
	 */
	getResponse = (msg) => {
		const { ack, rpc } = msg

		if (rpc) {
			const handler = this.rpcHandlers[rpc]
			return handler
		}

		const handler = this.requests[ack]
		this.requests[ack] = null

		return handler
	}

	/**
	 *	Updates the API's auth token
	 * @private
	 * @param {string} token The new auth token
	 */
	updateAuthToken = (token) => {
		this.authToken = token
	}
}
