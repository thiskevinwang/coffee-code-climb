import { gql } from "@apollo/client"

export enum CommentOrderByInput {
  created_ASC = "created_ASC",
  created_DESC = "created_DESC",
}

export const GET_COMMENTS_BY_URL_QUERY = gql`
  query GetCommentsByURL($url: String!, $filter: CommentOrderByInput) {
    getCommentsByUrl(url: $url, filter: $filter) {
      body
      created
      id
      url
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
