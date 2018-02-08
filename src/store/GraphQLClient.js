import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

export default class GraphQLClient {

  client = null

  constructor(host) {
    const httpLink = createHttpLink({
      uri: host,
    })

    const logoutLink = onError(({ networkError }) => {
      if (networkError.statusCode === 401) console.log("unauthorized")
    })

    const authLink = setContext((_, { headers }) => {
      const session = JSON.parse(localStorage.getItem('session'));
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

  query(query) {
    this.client.query({
      query: gql``
    })
  }
}
