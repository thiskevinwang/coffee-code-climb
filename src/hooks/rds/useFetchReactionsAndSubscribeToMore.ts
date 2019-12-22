import { gql } from "apollo-boost"
import { useLazyQuery, useSubscription } from "@apollo/react-hooks"

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
  variant: ReactionVariant
  created: Date
  updated: Date
  user: {
    id: number
  }
  comment: {
    id: number
    reactions: Reaction[]
  }
}

export const useFetchReactionsAndSubscribeToMore = () => {
  return {
    lazyQueryProps: useLazyQuery(QUERY),
    subscriptionProps: useSubscription(SUBSCRIPTION),
  }
}
