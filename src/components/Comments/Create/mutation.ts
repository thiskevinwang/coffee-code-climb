import { gql } from "apollo-boost"

export const CREATE_COMMENT_MUTATION = gql`
  mutation($body: String!, $url: String!) {
    createComment(body: $body, url: $url) {
      id
      body
      created
      url
      user {
        id
        email
        username
        password
        last_name
        first_name
        avatar_url
      }
      # reactions will be null
      reactions {
        id
      }
    }
  }
`
