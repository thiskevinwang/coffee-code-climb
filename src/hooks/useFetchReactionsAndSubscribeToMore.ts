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
// import fetch from "isomorphic-fetch"

const QUERY = gql`
  query {
    getAllReactions {
      id
      variant
      created
      updated
      user {
        id
      }
      comment {
        id
      }
    }
  }
`
const SUBSCRIPTION = gql`
  subscription {
    newReaction {
      id
      variant
      created
      updated
      user {
        id
      }
      comment {
        id
      }
    }
  }
`
export type Reaction = {
  id: number
  variant: string
  created: Date
  updated: Date
  user: {
    id: number
  }
  comment: {
    id: number
  }
}

const ENDPOINT = process.env.GATSBY_RDS_API_ENDPOINT
const HTTPS_PROTOCOL = "https://"
const WSS_PROTOCOL = "wss://"
const QUERY_ENDPOINT = `${HTTPS_PROTOCOL}${ENDPOINT}`
const SUBSCRIPTION_ENDPOINT = `${WSS_PROTOCOL}${ENDPOINT}`
// const GRAPHQL_ENDPOINT = "ws://localhost:4044/graphql"

export const useFetchReactionsAndSubscribeToMore = () => {
  const [subscriptionClient] = useState(
    () =>
      new SubscriptionClient(SUBSCRIPTION_ENDPOINT, {
        reconnect: true,
      })
  )
  const [wsLink] = useState(() => new WebSocketLink(subscriptionClient))
  const [httpLink] = useState(() => new HttpLink({ uri: QUERY_ENDPOINT }))
  const [link] = useState(() =>
    split(
      // split based on operation type
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query)
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

  return [
    useLazyQuery(QUERY, { client }),
    useSubscription(SUBSCRIPTION, { client }),
    client,
  ]
}
