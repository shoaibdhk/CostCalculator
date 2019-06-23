import withApollo from 'next-with-apollo'
// import ApolloClient, { InMemoryCache } from 'apollo-boost'
// import { GRAPHQL_URL, GRAPHQL_URL_PROD } from '../config'

// function createClient({ headers, initialState }) {
//   return new ApolloClient({
//     uri: process.env.NODE_ENV === 'development' ? GRAPHQL_URL : GRAPHQL_URL_PROD,
//     // cache: new InMemoryCache().restore(initialState || {}),
//     request: operation => {
//       operation.setContext({
//         fetchOptions: {
//           credentials: 'include'
//         },
//         headers
//       })
//     }
//   })
// }

// export default withApollo(createClient)

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import { GRAPHQL_URL, GRAPHQL_URL_PROD } from '../config'

// Create a middleware Auth where every time it sends and access the header the cookies
const middlewareAuthLink = headers =>
  new ApolloLink((operation, forward) => {
    operation.setContext({
      headers,
      fetchOptions: {
        credentials: 'include'
      }
    })
    return forward(operation)
  })

// Link with GraphQL URL so that it sends the cookies to backend
const httpLinkWithAuthToken = headers =>
  middlewareAuthLink(headers).concat(
    createHttpLink({
      uri: process.env.NODE_ENV === 'development' ? GRAPHQL_URL : GRAPHQL_URL_PROD
    })
  )

const client = ({ headers }) =>
  new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          sendToLoggingService(graphQLErrors)
        }
        if (networkError) {
          logoutUser()
        }
      }),
      httpLinkWithAuthToken(headers)
    ]),
    cache: new InMemoryCache()
  })

// Finally wrap with next apollo package
export default withApollo(client)
