import React from "react"
import sortBy from "lodash/sortBy"

// Components
import { Link, graphql, PageProps } from "gatsby"
import Bio from "components/bio"
import { LayoutManager } from "components/layoutManager"
// import SEO from "../components/seo"

// Utilities
import { rhythm } from "utils/typography"

/** @deprecated - This will be broken by the new File System Route API */
interface PageContext {
  tag: string
}

const Tags = ({
  data,
  pageContext,
  location,
}: PageProps<QueryData, PageContext>) => {
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
    [...contentfulEdges, ...markdownRemarkEdges],
    ({ node }) => {
      let date = new Date(
        "frontmatter" in node ? node.frontmatter.date : node.date
      )
      return -date
    }
  )

  const tagHeader = `${totalCount} post${
    totalCount === 1 ? "" : "s"
  } tagged with "${tag}"`
  const siteTitle = data.site.siteMetadata.title

  return (
    <LayoutManager location={location}>
      <div
        style={{
          marginBottom: rhythm(1 / 4),
        }}
      >
        <h1>{tagHeader}</h1>
        <ul>
          {edges.map(({ node }) => {
            const { slug } = "fields" in node ? node.fields : node
            const { title } = "frontmatter" in node ? node.frontmatter : node
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
    </LayoutManager>
  )
}

export default Tags

interface QueryData {
  site: {
    siteMetadata: {
      title: string
    }
  }
  allMarkdownRemark: {
    totalCount: number
    edges: {
      node: {
        internal: {
          type: "MarkdownRemark"
        }
        fields: {
          slug: string
        }
        frontmatter: {
          title: string
          date: string
        }
      }
    }[]
  }
  allContentfulBlogPost: {
    totalCount: number
    edges: {
      node: {
        internal: {
          type: "ContentfulBlogPost"
        }
        slug: string
        title: string
        date: string
      }
    }[]
  }
}

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
