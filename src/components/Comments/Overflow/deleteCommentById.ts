import { gql } from "apollo-boost"

export const DELETE_COMMENT_BY_ID = gql`
  mutation DeleteCommentById($id: ID!) {
    deleteCommentById(id: $id) {
      id
    }
  }
`
