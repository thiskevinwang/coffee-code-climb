import { gql } from "apollo-boost"
import { useLazyQuery, useSubscription } from "@apollo/client"

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

export const NEW_COMMENT_SUBSCRIPTION = gql`
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

const NEW_REACTION_SUBSCRIPTION = gql`
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
    newCommentSubscription: useSubscription(NEW_COMMENT_SUBSCRIPTION),
    newReactionSubscription: useSubscription(NEW_REACTION_SUBSCRIPTION),
  }
}
