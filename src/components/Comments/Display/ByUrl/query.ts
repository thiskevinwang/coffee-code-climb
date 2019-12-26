import { gql } from "apollo-boost"

export const GET_COMMENTS_BY_URL_QUERY = gql`
  query($url: String!) {
    getCommentsByUrl(url: $url) {
      id
      body
      created
      user {
        id
        avatar_url
        first_name
        last_name
        username
      }
      reactions {
        id
        variant
      }
    }
  }
`
