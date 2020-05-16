import React, { useRef, useState, useEffect } from "react"
import { graphql } from "gatsby"
import { gql } from "apollo-boost"

import Layout from "../components/layout"
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
const GitHubPage = (props) => {
  const { loading, error, data } = useFetchGithub(QUERY)

  if (loading) return "loading..."
  if (error) return "error..."

  return (
    <Layout location={props.location}>
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
    </Layout>
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
