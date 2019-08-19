import React from "react"
import { useSelector } from "react-redux"
import _ from "lodash"
import moment from "moment"
import { graphql } from "gatsby"
import { Grid } from "@material-ui/core"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { Post } from "../components/Post"

const KEYWORDS = [
  `blog`,
  `gatsby`,
  `gatsbyjs`,
  `react`,
  `reactjs`,
  `new york`,
  `rock climbing`,
  `javascript`,
  `react`,
  `coffee`,
  `coding`,
  `climb`,
  `coffeecodeclimb`,
  `coffee code climb`,
  `climbing`,
  `kevin wang`,
  `graphql`,
  `apollo`,
  `node`,
  `nextjs`,
  `redux`,
  `hooks`,
  `typescript`,
]

/**
 * BlogIndex
 * Our landing page component!
 */
const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const markdownPosts = data.allMarkdownRemark.edges
  const contentfulPosts = data.allContentfulBlogPost.edges

  // use this to test child rerenders
  const isDarkMode = useSelector(state => state.isDarkMode)

  /**
   * Combine Markdown & Contentful posts. Sort by newest Date.
   */
  const posts = _.sortBy(
    _.concat([], [...contentfulPosts, ...markdownPosts]),
    ({ node }) => {
      let date = moment(
        node.internal.type === `MarkdownRemark`
          ? node.frontmatter.date
          : node.date
      )
      return -date
    }
  )

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" keywords={KEYWORDS} />
      <Bio />

      <Grid container direction="row" spacing={4}>
        {posts.map(({ node }, index) => {
          const isMarkdownRemark = node.internal.type === `MarkdownRemark`
          const isContentfulBlogPost =
            node.internal.type === `ContentfulBlogPost`

          const title =
            node.internal.type === `MarkdownRemark` &&
            (node.frontmatter.title || node.fields.slug)

          return (
            <Post
              key={isMarkdownRemark ? node.fields.slug : node.slug}
              linkTo={isMarkdownRemark ? node.fields.slug : node.slug}
              date={isMarkdownRemark ? node.frontmatter.date : node.date}
              title={isMarkdownRemark ? title : node.title}
              description={
                isMarkdownRemark
                  ? node.frontmatter.description
                  : node.description
              }
              excerpt={isMarkdownRemark ? node.excerpt : null}
              tags={isMarkdownRemark ? node.frontmatter.tags : node.tags}
              origin={isMarkdownRemark ? location.origin : null}
              id={node.id}
              image={isMarkdownRemark ? node.frontmatter.image : node.image}
              index={index}
              nodeType={node.internal.type}
            />
          )
        })}
      </Grid>
    </Layout>
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
