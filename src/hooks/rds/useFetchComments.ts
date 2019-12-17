import { useState } from "react"
import { HttpLink } from "apollo-link-http"
import { WebSocketLink } from "apollo-link-ws"
import { split } from "apollo-link"
import { getMainDefinition } from "apollo-utilities"
import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { gql } from "apollo-boost"
import { useLazyQuery, useSubscription } from "@apollo/react-hooks"
import { SubscriptionClient } from "subscriptions-transport-ws"
import * as ws from "ws"
import { OperationDefinitionNode } from "graphql"

const QUERY = gql`
  query {
    getAllComments {
      id
      body
      url
      created
      updated
      deleted
      user {
        id
        username
        first_name
        last_name
      }
      reactions {
        id
        variant
      }
    }
  }
`

const SUBSCRIPTION = gql`
  subscription {
    newComment {
      id
      body
      url
      created
      updated
      deleted
      user {
        id
        username
        first_name
        last_name
      }
    }
  }
`

export type Comment = {
  id: number
  body: string
  url: string
  created: Date
  updated: Date
  deleted: boolean
  user: {
    id: number
    username: string
    first_name: string
    last_name: string
  }
  reactions: {
    id: number
    variant: "Like" | "Love" | "Haha" | "Wow" | "Sad" | "Angry" | "None"
  }[]
}

const ENDPOINT = process.env.GATSBY_RDS_API_ENDPOINT
const HTTPS_PROTOCOL = "https://"
const WSS_PROTOCOL = "wss://"
const QUERY_ENDPOINT = `${HTTPS_PROTOCOL}${ENDPOINT}`
const SUBSCRIPTION_ENDPOINT = `${WSS_PROTOCOL}${ENDPOINT}`
// const GRAPHQL_ENDPOINT = "ws://localhost:4044/graphql"

export const useFetchComments = () => {
  const [subscriptionClient] = useState(
    /**
     * Passing `ws` as the 3rd constructor argument fixes this error when running `gatsby build`
     * > WebpackError: Unable to find native implementation, or alternative implementation for WebSocket!
     * @see https://github.com/apollographql/subscriptions-transport-ws/issues/191#issuecomment-311441663
     *
     * Error: ws does not work in the browser. Browser clients must use the native WebSocket object
     * - so only add it when window is undefined, aka during build process / ssr
     */
    () =>
      new SubscriptionClient(
        SUBSCRIPTION_ENDPOINT,
        { reconnect: true },
        typeof window === "undefined" && ws
      )
  )
  const [wsLink] = useState(() => new WebSocketLink(subscriptionClient))
  const [httpLink] = useState(() => new HttpLink({ uri: QUERY_ENDPOINT }))
  const [link] = useState(() =>
    split(
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
  )
  const [client] = useState(
    () =>
      new ApolloClient({
        link: link,
        cache: new InMemoryCache(),
      })
  )

  return {
    lazyQueryProps: useLazyQuery(QUERY, { client }),
    subscriptionProps: useSubscription(SUBSCRIPTION, { client }),
    client,
  }
}
