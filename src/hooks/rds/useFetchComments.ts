import { gql } from "apollo-boost"
import { useLazyQuery, useSubscription } from "@apollo/react-hooks"

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
        avatar_url
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
        avatar_url
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
    avatar_url: string
  }
  reactions: {
    id: number
    variant: "Like" | "Love" | "Haha" | "Wow" | "Sad" | "Angry" | "None"
  }[]
}

export const useFetchComments = () => {
  return {
    lazyQueryProps: useLazyQuery(QUERY),
    subscriptionProps: useSubscription(SUBSCRIPTION),
  }
}
