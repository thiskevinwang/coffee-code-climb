import { useState } from "react"
import ApolloClient, { gql, GraphQLRequest } from "apollo-boost"
import { useLazyQuery, useQuery } from "@apollo/react-hooks"
import fetch from "isomorphic-fetch"

/**
 * # token
 * An authorization token needed in the headers of mutations/queries
 * @see https://github.com/settings/tokens
 */
const token = process.env.GATSBY_GITHUB_TOKEN
const URI = "https://api.github.com/graphql"

const useFetchGithub = (
  query: GraphQLRequest,
  variables = { owner: "thiskevinwang", name: "coffee-code-climb" }
) => {
  const [githubClient] = useState(
    () =>
      new ApolloClient({
        uri: URI,
        headers: {
          authorization: token ? `Bearer ${token}` : "",
        },
        fetch,
      })
  )
  const { loading, error, data } = useQuery(query, {
    client: githubClient,
    variables,
  })
  return { loading, error, data }
}

export { useFetchGithub }
