import withApollo from 'next-with-apollo'
import ApolloClient, { InMemoryCache } from 'apollo-boost'
import { GRAPHQL_URL, GRAPHQL_URL_PROD } from '../config'

function createClient({ headers, initialState }) {
  return new ApolloClient({
    // credentials: 'include',
    uri: process.env.NODE_ENV === 'development' ? GRAPHQL_URL : GRAPHQL_URL_PROD,
    cache: new InMemoryCache().restore(initialState || {}),
    request: operation => {
      operation.setContext({
        credentials: 'include',
        headers
      })
    }
  })
}

export default withApollo(createClient)
