import React from "react"
import union from "lodash/union"
import sortBy from "lodash/sortBy"

// Components
import { Link, graphql, PageProps } from "gatsby"
import Bio from "components/bio"
import { LayoutManager } from "components/layoutManager"
// import SEO from "../components/seo"

// Utilities
import { rhythm } from "utils/typography"

const Tags = ({ pageContext, data, location }: PageProps) => {
  console.log(pageContext, data)
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
    <LayoutManager location={location} title={siteTitle}>
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

        <Link to="/tags">All tags</Link>
      </div>
      <hr
        style={{
          marginBottom: rhythm(1),
        }}
      />
      <Bio />
    </LayoutManager>
  )
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
