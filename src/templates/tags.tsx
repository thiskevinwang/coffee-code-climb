import React from "react"
import PropTypes from "prop-types"
import union from "lodash/union"
import sortBy from "lodash/sortBy"

// Components
import { Link, graphql } from "gatsby"
import Bio from "../components/bio"
import Layout from "../components/layout"
// import SEO from "../components/seo"

// Utilities
import { rhythm } from "@src/utils/typography"

const Tags = ({ pageContext, data, location }) => {
  const { tag } = pageContext
  const {
    edges: markdownRemarkEdges,
    totalCount: markdownRemarkTotalCount,
  } = data.allMarkdownRemark
  const {
    edges: contentfulEdges,
    totalCount: contentfulTotalCount,
  } = data.allContentfulBlogPost

  let totalCount: number = markdownRemarkTotalCount + contentfulTotalCount

  /**
   * Combine Markdown & Contentful posts. Sort by newest Date.
   */
  let edges = sortBy(
    union(contentfulEdges, markdownRemarkEdges),
    ({ node }) => {
      let date = new Date(
        node.internal.type === `MarkdownRemark`
          ? node.frontmatter.date
          : node.date
      )

      return -date
    }
  )

  const tagHeader = `${totalCount} post${
    totalCount === 1 ? "" : "s"
  } tagged with "${tag}"`
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <div
        style={{
          marginBottom: rhythm(1 / 4),
        }}
      >
        <h1>{tagHeader}</h1>
        <ul>
          {edges.map(({ node }) => {
            const { slug } =
              node.internal.type === `MarkdownRemark` ? node.fields : node
            const { title } =
              node.internal.type === `MarkdownRemark` ? node.frontmatter : node
            return (
              <li key={slug}>
                <Link to={slug}>{title}</Link>
              </li>
            )
          })}
        </ul>
        {/*
              This links to a page that does not yet exist.
              We'll come back to it!
            */}
        <Link to="/tags">All tags</Link>
      </div>
      <hr
        style={{
          marginBottom: rhythm(1),
        }}
      />
      <Bio />
    </Layout>
  )
}

Tags.propTypes = {
  pageContext: PropTypes.shape({
    tag: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
            }),
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
            }),
          }),
        }).isRequired
      ),
    }),
  }),
}

export default Tags

export const pageQuery = graphql`
  query($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          internal {
            type
          }
          fields {
            slug
          }
          frontmatter {
            title
            date
          }
        }
      }
    }
    allContentfulBlogPost(
      limit: 2000
      sort: { fields: [date], order: DESC }
      filter: { tags: { in: [$tag] } }
    ) {
      totalCount
      edges {
        node {
          internal {
            type
          }
          slug
          title
          date
        }
      }
    }
  }
`
