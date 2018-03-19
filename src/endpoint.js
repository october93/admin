let endpoint = `${location.origin}/graphql`
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  endpoint = 'http://localhost:9000/graphql'
}
export default endpoint
