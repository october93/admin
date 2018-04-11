// configuring GraphQL endpoint
let graphqlURL = `${location.origin}/graphql`
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  graphqlURL = 'http://localhost:9000/graphql'
}

let wsProtocol = 'ws:'
if (location.protocol === 'https:') {
	wsProtocol = 'wss:'
}

export const graphqlEndpoint = graphqlURL

// configuration WebSocket endpoint
export const websocketEndpoint = sessionID => {
	const defaultServerURL = `${location.hostname === "localhost" ? location.hostname + ":9000" : location.hostname}`

	let websocketURL = `${wsProtocol}//${defaultServerURL}/deck_endpoint/`

	if (sessionID !== undefined) {
		websocketURL += `?session=${sessionID}&adminpanel=true`
	}
	return websocketURL
}
