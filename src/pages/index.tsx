import React from "react"
import { useSelector, useDispatch } from "react-redux"
import _ from "lodash"
import moment from "moment"
import { graphql } from "gatsby"
import { Grid } from "@material-ui/core"
import { animated, useSpring, config } from "react-spring"
import styled from "styled-components"

import Bio from "components/bio"
import Layout from "components/layout"
import { LayoutManager } from "components/layoutManager"
import SEO from "components/seo"
import { Post } from "components/Post"
import { setShowBlogImage } from "state"
import { rhythm } from "utils/typography"
import * as Colors from "consts/Colors"
import { KEYWORDS } from "consts"

/**
 * # FROM_STYLE
 * - starting animated-style
 */
const FROM_STYLE = {
  boxShadow: `0px 10px 20px -10px ${Colors.blackDark}`,
  transform: `scale(1)`,
}
/**
 * # MOUSEOVER_STYLE
 * - target animated-style
 */
const MOUSEOVER_STYLE = {
  boxShadow: `0px 12px 25px -8px ${Colors.blackDarker}`,
  transform: `scale(1.05)`,
}
/**
 * # MOUSEDOWN_STYLE
 */
const MOUSEDOWN_STYLE = {
  boxShadow: `0px 10px 10px -12px ${Colors.blackDarker}`,
  transform: `scale(0.98)`,
}
const SpringButton = styled(animated.button)`
  border-radius: 5px;
  border: none;
  letter-spacing: ${rhythm(0.1)};
  margin-bottom: ${rhythm(1)};
  text-transform: uppercase;
`
/**
 * BlogIndex
 * Our landing page component!
 */
const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const markdownPosts = data.allMarkdownRemark.edges
  const contentfulPosts = data.allContentfulBlogPost.edges

  const showBlogImage = useSelector(state => state.showBlogImage)
  const dispatch = useDispatch()
  const dispatchToggleBlogImage = () =>
    dispatch(setShowBlogImage(!showBlogImage))

  const [springProps, set] = useSpring(() => {
    return {
      from: { ...FROM_STYLE },
      to: { ...FROM_STYLE },
      config: config.wobbly,
    }
  })
  const updateStyles = stylesObject => e => {
    set({ ...stylesObject })
  }

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
    <LayoutManager location={location} title={siteTitle}>
      <SEO title="All posts" keywords={KEYWORDS} />
      <Bio />

      <SpringButton
        style={springProps}
        onMouseEnter={updateStyles(MOUSEOVER_STYLE)}
        onMouseLeave={updateStyles(FROM_STYLE)}
        onMouseDown={updateStyles(MOUSEDOWN_STYLE)}
        onMouseUp={updateStyles(MOUSEOVER_STYLE)}
        onTouchStart={updateStyles(MOUSEDOWN_STYLE)}
        onTouchEnd={updateStyles(FROM_STYLE)}
        onClick={dispatchToggleBlogImage}
      >
        {showBlogImage ? "hide images" : "show images"}
      </SpringButton>

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
              showBlogImage={showBlogImage}
            />
          )
        })}
      </Grid>
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
