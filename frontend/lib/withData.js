import withApollo from 'next-with-apollo'
import ApolloClient from 'apollo-boost'
import { GRAPHQL_URL, GRAPHQL_URL_PROD } from '../config'

function createClient({ headers }) {
  return new ApolloClient({
    credentials: 'include',
    uri: process.env.NODE_ENV === 'development' ? GRAPHQL_URL : GRAPHQL_URL_PROD,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include'
        },
        headers
      })
    }
  })
}

export default withApollo(createClient)
