import React from "react"
import _ from "lodash"
import { graphql } from "gatsby"

import Bio from "components/bio"
import { LayoutManager } from "components/layoutManager"
import { PostsManager } from "components/PostsManager"
import SEO from "components/seo"
import { KEYWORDS } from "consts"
s

/**
 * BlogIndex
 * Our landing page component!
 */
const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const markdownPosts = data.allMarkdownRemark.edges
  const contentfulPosts = data.allContentfulBlogPost.edges
  /**
   * unsorted
   */
  const allPosts = [...markdownPosts, ...contentfulPosts]

  return (
    <LayoutManager location={location} title={siteTitle}>
      <SEO title="All posts" keywords={KEYWORDS} />
      <Bio />

      <PostsManager
        allPosts={allPosts}
        /**
         * **props.location** is only available in the `/pages` directory
         * @TODO
         * see if there's a way to create & hook into context, or some
         * alternative to props-juggling this down to <PostsManager>
         * - maybe react-router v5?
         */
        location={location}
        title={siteTitle}
      />
    </LayoutManager>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          internal {
            type
          }
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            tags
            image {
              childImageSharp {
                fluid(maxWidth: 2000, maxHeight: 800) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
          id
        }
      }
    }
    allContentfulBlogPost(sort: { fields: [date], order: DESC }) {
      edges {
        node {
          internal {
            type
          }
          image {
            fluid(maxWidth: 2000, maxHeight: 800) {
              ...GatsbyContentfulFluid_withWebp
            }
          }
          title
          date(formatString: "MMMM DD, YYYY")
          description
          tags
          slug
        }
      }
    }
  }
`
