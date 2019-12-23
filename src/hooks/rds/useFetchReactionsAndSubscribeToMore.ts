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

export const useFetchReactionsAndSubscribeToMore = () => {
  return {
    lazyQueryProps: useLazyQuery(QUERY),
    subscriptionProps: useSubscription(SUBSCRIPTION),
  }
}
