import withApollo from 'next-with-apollo'
import ApolloClient from 'apollo-boost'
import { GRAPHQL_URL, GRAPHQL_URL_PROD } from '../config'

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? GRAPHQL_URL : GRAPHQL_URL_PROD,
    request: operation => {
      operation.setContext({
        headers
      })
    }
  })
}

export default withApollo(createClient)
