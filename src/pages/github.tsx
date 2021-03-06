import React from "react"
import { graphql, PageProps } from "gatsby"
import { gql } from "@apollo/client"

import { LayoutManager } from "components/layoutManager"
import SEO from "../components/seo"

import { useFetchGithub } from "hooks/useFetchGithub"

//https://developer.github.com/v4/explorer/
const QUERY = gql`
  {
    repository(owner: "thiskevinwang", name: "coffee-code-climb") {
      stargazers(orderBy: { field: STARRED_AT, direction: DESC }, first: 50) {
        edges {
          node {
            name
            avatarUrl
          }
        }
        totalCount
      }
      url
    }
  }
`
const GitHubPage = (props: PageProps) => {
  const { loading, error, data } = useFetchGithub(QUERY)

  if (loading) return "loading..."
  if (error) return "error..."

  return (
    <LayoutManager location={props.location}>
      <SEO title="Stargazers" />
      <h1>Stargazers</h1>

      <>
        {data.repository.stargazers.edges.map(
          ({ node: { name, avatarUrl } }, i) => (
            <img
              width={75}
              src={avatarUrl}
              style={{ borderRadius: `100%` }}
              key={i}
            />
          )
        )}
      </>
    </LayoutManager>
  )
}

export default GitHubPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
