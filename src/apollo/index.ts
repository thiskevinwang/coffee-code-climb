import { ApolloProvider } from "@apollo/react-hooks"
import { HttpLink } from "apollo-link-http"
import { WebSocketLink } from "apollo-link-ws"
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

const subscriptionClient =
  /**
   * Passing `ws` as the 3rd constructor argument fixes this error when running `gatsby build`
   * > WebpackError: Unable to find native implementation, or alternative implementation for WebSocket!
   * @see https://github.com/apollographql/subscriptions-transport-ws/issues/191#issuecomment-311441663
   *
   * Error: ws does not work in the browser. Browser clients must use the native WebSocket object
   * - so only add it when window is undefined, aka during build process / ssr
   */
  new SubscriptionClient(
    SUBSCRIPTION_ENDPOINT,
    { reconnect: true },
    typeof window === "undefined" && ws
  )

const wsLink = new WebSocketLink(subscriptionClient)
const httpLink = new HttpLink({ uri: QUERY_ENDPOINT })
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(
      query
    ) as OperationDefinitionNode
    return kind === "OperationDefinition" && operation === "subscription"
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  link: link,
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
