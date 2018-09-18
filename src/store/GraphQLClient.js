import ApolloClient from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'

export default class GraphQLClient {
  instance = null

  client = null

  constructor(host) {
    const httpLink = createHttpLink({
      uri: host,
    })

    const logoutLink = onError(({ networkError }) => {
			if (networkError.statusCode === 401) {
				localStorage.removeItem('session')
				window.location.replace('/admin/login')
			}
    })

    const authLink = setContext((_, { headers }) => {
      const session = JSON.parse(localStorage.getItem('session'))
      return {
        headers: {
          ...headers,
          Authorization: session.id,
        }
      }
    })

    this.client = new ApolloClient({
      link: authLink.concat(logoutLink.concat(httpLink)),
      cache: new InMemoryCache()
    })
  }

  static init(host) {
    const httpLink = createHttpLink({
      uri: host,
    })

    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (networkError) {
        if (networkError.statusCode === 401)
          console.log("unauthorized")
        else
          console.error(`[Network error]: ${networkError}`)
        return
      }

      if (graphQLErrors){
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        )
      }
    })

    const authLink = setContext((_, { headers }) => {
      const session = JSON.parse(localStorage.getItem('session'))
      return {
        headers: {
          ...headers,
          Authorization: session.id,
        }
      }
    })

    const inst = new GraphQLClient()

    inst.client = new ApolloClient({
      link: authLink.concat(errorLink.concat(httpLink)),
      cache: new InMemoryCache()
    })

    this.instance = inst
  }

  static Client() {
    return this.instance
  }

  query = async (query) => {
    return this.client.query({
      ...query,
      fetchPolicy: 'network-only',
    })
  }

  mutate = async (mutation) => {
    return this.client.mutate(mutation)
  }
}
