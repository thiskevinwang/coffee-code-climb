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

const SUBSCRIPTION_NEW_COMMENT = gql`
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

const SUBSCRIPTION_NEW_REACTION = gql`
  subscription {
    newReaction {
      id
      variant
      comment {
        id
      }
    }
  }
`

export const useFetchComments = () => {
  return {
    getAllCommentsLazyQuery: useLazyQuery(QUERY),
    newCommentSubscription: useSubscription(SUBSCRIPTION_NEW_COMMENT),
    newReactionSubscription: useSubscription(SUBSCRIPTION_NEW_REACTION),
  }
}
