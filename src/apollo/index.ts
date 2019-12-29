import { ApolloProvider } from "@apollo/react-hooks"
import { HttpLink } from "apollo-link-http"
import { WebSocketLink } from "apollo-link-ws"
import { setContext } from "apollo-link-context"
import { split } from "apollo-link"
import { getMainDefinition } from "apollo-utilities"
import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { gql } from "apollo-boost"
import { SubscriptionClient } from "subscriptions-transport-ws"
import * as ws from "ws"
import { OperationDefinitionNode } from "graphql"
import fetch from "isomorphic-fetch"

const ENDPOINT = process.env.GATSBY_RDS_API_ENDPOINT
const HTTPS_PROTOCOL = "https://"
const WSS_PROTOCOL = "wss://"
const QUERY_ENDPOINT = `${HTTPS_PROTOCOL}${ENDPOINT}`
const SUBSCRIPTION_ENDPOINT = `${WSS_PROTOCOL}${ENDPOINT}`

const __DEV__ = process.env.NODE_ENV !== "production"

/** ignore SubscriptionClient for now */
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
  uri: __DEV__ ? "http://localhost:4044/graphql" : QUERY_ENDPOINT,
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

// https://www.apollographql.com/docs/react/networking/authentication/#header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token")
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
  /** Ignore subscriptionClient for now */
  // link: authLink.concat(link),
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  /**
   * Passing fetch here fixes "Webpack Invariant" error when gatsby compiles
   * https://github.com/gatsbyjs/gatsby/issues/3650#issuecomment-410146046
   */
  fetch,
})

const GET_PAGE = gql`
  query($id: Int!, $location: String!) {
    getPage(id: $id, location: $location) {
      id
      location
      attributes {
        views
        updated_at
        created_at
      }
    }
  }
`

const CREATE_PAGE = gql`
  mutation createPage($id: Int!, $location: String!) {
    createPage(id: $id, location: $location) {
      id
      location
      attributes {
        views
        created_at
        updated_at
      }
    }
  }
`

const INCREMENT_VIEWS = gql`
  mutation incrementViews($id: Int!, $location: String!) {
    incrementViews(id: $id, location: $location) {
      views
      created_at
      updated_at
    }
  }
`

const TRACK_IP_VISITS = gql`
  mutation {
    trackIpVisits
  }
`

export {
  ApolloProvider,
  client,
  CREATE_PAGE,
  GET_PAGE,
  INCREMENT_VIEWS,
  TRACK_IP_VISITS,
}
