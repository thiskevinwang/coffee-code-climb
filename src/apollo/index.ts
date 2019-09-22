import ApolloClient, { gql } from "apollo-boost"

/**
 * # token
 * An authorization token needed in the headers of mutations/queries
 * @see https://github.com/settings/tokens
 */
const token = process.env.REACT_APP_GITHUB_TOKEN

/**
 * # client
 * Initialize the client
 */
const client = new ApolloClient({
  uri:
    process.env.NODE_ENV === "development"
      ? "http://localhost:4000/"
      : "https://graphql-server-example.thekevinwang.now.sh/",
  headers: {
    authorization: token ? `Bearer ${token}` : "",
  },
})

const GET_PAGE = gql`
  query($id: Int!, $location: String!) {
    getPage(id: $id, location: $location) {
      id
      location
      attributes {
        views
        updated_at
        created_at
      }
    }
  }
`

const CREATE_PAGE = gql`
  mutation createPage($id: Int!, $location: String!) {
    createPage(id: $id, location: $location) {
      id
      location
      attributes {
        views
        created_at
        updated_at
      }
    }
  }
`

const INCREMENT_VIEWS = gql`
  mutation incrementViews($id: Int!, $location: String!) {
    incrementViews(id: $id, location: $location) {
      views
      created_at
      updated_at
    }
  }
`

export { client, CREATE_PAGE, GET_PAGE, INCREMENT_VIEWS }
