import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import fetch from "isomorphic-fetch"

const __DEV__ = process.env.NODE_ENV !== "production"

// TODO Cleanup netlify env vars
const PROD_API_ENDPOINT = `https://${process.env.GATSBY_RDS_API_ENDPOINT}`
const DEV_API_ENDPOINT = `http://${process.env.GATSBY_DEV_API_ENDPOINT}`

/**
 * @NOTE
 * ignore SubscriptionClient for now
 */
// const subscriptionClient =
//   /**
//    * Passing `ws` as the 3rd constructor argument fixes this error when running `gatsby build`
//    * > WebpackError: Unable to find native implementation, or alternative implementation for WebSocket!
//    * @see https://github.com/apollographql/subscriptions-transport-ws/issues/191#issuecomment-311441663
//    *
//    * Error: ws does not work in the browser. Browser clients must use the native WebSocket object
//    * - so only add it when window is undefined, aka during build process / ssr
//    */
//   new SubscriptionClient(
//     __DEV__ ? "ws://localhost:4044/graphql" : SUBSCRIPTION_ENDPOINT,
//     { reconnect: true },
//     typeof window === "undefined" && ws
//   )

// const wsLink = new WebSocketLink(subscriptionClient)
const httpLink = new HttpLink({
  uri: __DEV__ ? DEV_API_ENDPOINT : PROD_API_ENDPOINT,
})
// const link = split(
//   // split based on operation type
//   ({ query }) => {
//     const { kind, operation } = getMainDefinition(
//       query
//     ) as OperationDefinitionNode
//     return kind === "OperationDefinition" && operation === "subscription"
//   },
//   wsLink,
//   httpLink
// )

/**
 * @see https://www.apollographql.com/docs/react/networking/authentication/#header
 */
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  let token
  const cognito = localStorage.getItem("cognito")
  if (cognito) {
    token = JSON.parse(cognito)?.AuthenticationResult?.AccessToken
  }
  // return the headers to the context so thhe link can read them

  /**
   * @warning
   * `Authorization` needs to come first, as `headers` may contain
   * an imperatively set `Authorization` from a mutation/query. In
   * that case, we want the later to take precedence over the
   * `Authorization` value here, so we destructure `headers` AFTER
   * `Authorization`
   */
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      ...headers,
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  /**
   * Passing fetch here fixes "Webpack Invariant" error when gatsby compiles
   * https://github.com/gatsbyjs/gatsby/issues/3650#issuecomment-410146046
   */
  fetch,
})

export { ApolloProvider, client }
