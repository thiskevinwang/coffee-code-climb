import { gql } from "apollo-boost"

export const GET_USER_BY_ID_QUERY = gql`
  query($id: ID!) {
    getUserById(id: $id) {
      id
      username
      email
      first_name
      last_name
      created
      updated
      verified_date
      avatar_url
      comments {
        id
      }
      reactions {
        id
      }
    }
  }
`
