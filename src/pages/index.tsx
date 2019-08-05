import React, { useState } from "react"
import _ from "lodash"
import moment from "moment"
import { Link, graphql } from "gatsby"
import Image from "gatsby-image"
import { CommentCount } from "disqus-react"
import { Grid, Tooltip } from "@material-ui/core"
import { animated, useSprings, AnimatedValue, config } from "react-spring"
import styled from "styled-components"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "src/utils/typography"
import * as Colors from "consts/Colors"

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
  `flow`,
  `kevin wang`,
  `graphql`,
  `apollo`,
  `node`,
  `nextjs`,
]
interface Props {
  key: string
  linkTo: string
  date: string
  title: string
  description: string
  excerpt: string
  tags: Array<string>
  id: string
  image: { fluid: { any } }
  index: number
  nodeType: string
  animatedStyles: AnimatedValue<any>
  _handleMouseEnter: () => void
  _handleMouseLeave: () => void
  _handleMouseDown: () => void
  _handleMouseUp: () => void
}

function Post({
  linkTo,
  date,
  title,
  description,
  excerpt,
  tags,
  // origin,
  id,
  image,
  index,
  nodeType,
  animatedStyles,
  _handleMouseEnter,
  _handleMouseLeave,
  _handleMouseDown,
  _handleMouseUp,
}: Props) {
  //_.map + _.kebabCase each tag in frontmatter.tags
  let kebabTags = _.map(tags, tag => _.kebabCase(tag))

  const disqusShortname = "coffeecodeclimb"
  const disqusConfig = {
    url: "https://coffeecodeclimb.com" + linkTo,
    identifier: id,
    title: title,
  }

  const Card = animated(styled.div`
    border-radius: 5px;
    /* box-shadow: 0px 10px 40px -10px ${Colors.blackDark}; */
    /* This clips the square top corners of the child image */
    overflow: hidden;
  `)

  const PostDetails = (
    <div
      style={{
        margin: rhythm(2 / 3),
      }}
    >
      <Link style={{ color: `inherit`, boxShadow: `none` }} to={linkTo}>
        <h3 style={{ marginTop: rhythm(1 / 2), marginBottom: rhythm(1 / 2) }}>
          {title}
        </h3>
        <small>{date}</small>
        <br />
        <small
          dangerouslySetInnerHTML={{
            __html: description || excerpt,
          }}
        />
      </Link>
      <br />
      {_.includes(kebabTags, "coffee") && (
        <Tooltip title={`tagged with "coffee"`}>
          <Link style={{ boxShadow: `none` }} to={"/tags/coffee/"}>
            <span role="img" aria-label="tagged with coffee">
              ☕️
            </span>
          </Link>
        </Tooltip>
      )}
      {_.includes(kebabTags, "code") && (
        <Tooltip title={`tagged with "code"`}>
          <Link style={{ boxShadow: `none` }} to={"/tags/code/"}>
            <span role="img" aria-label="tagged with code">
              💻
            </span>
          </Link>
        </Tooltip>
      )}
      {_.includes(kebabTags, "climbing") && (
        <Tooltip title={`tagged with "climbing"`}>
          <Link style={{ boxShadow: `none` }} to={"/tags/climbing/"}>
            <span role="img" aria-label="tagged with climbing">
              🧗🏻‍♂️
            </span>
          </Link>
        </Tooltip>
      )}{" "}
      <code>
        <small>
          <Link
            style={{ color: `inherit`, boxShadow: `none` }}
            to={`${linkTo}#disqus_thread`}
          >
            <CommentCount shortname={disqusShortname} config={disqusConfig}>
              Comments
            </CommentCount>
          </Link>
        </small>
      </code>
    </div>
  )

  return (
    <Grid
      item
      lg={index === 0 ? 12 : 3}
      md={index === 0 ? 12 : 4}
      sm={index === 0 ? 12 : 6}
      xs={12}
    >
      <Card
        className={"Card"}
        style={animatedStyles}
        onMouseEnter={_handleMouseEnter}
        onMouseLeave={_handleMouseLeave}
        onMouseDown={_handleMouseDown}
        onMouseUp={_handleMouseUp}
      >
        <Link style={{ boxShadow: `none` }} to={linkTo}>
          {image && (
            <Image
              fluid={
                nodeType === `MarkdownRemark`
                  ? image.childImageSharp.fluid
                  : image.fluid
              }
              alt={linkTo}
              style={{}}
              imgStyle={{}}
            />
          )}
        </Link>
        {PostDetails}
      </Card>
    </Grid>
  )
}

/**
 * BlogIndex
 * Our landing page component!
 */
const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const markdownPosts = data.allMarkdownRemark.edges
  const contentfulPosts = data.allContentfulBlogPost.edges

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

  /**
   * # FROM_STYLE
   * - starting animated-style
   */
  const FROM_STYLE = {
    boxShadow: `0px 10px 40px -10px ${Colors.blackDark}`,
    transform: `scale(1)`,
  }
  /**
   * # MOUSEOVER_STYLE
   * - target animated-style
   */
  const MOUSEOVER_STYLE = {
    boxShadow: `0px 12px 50px -13px ${Colors.blackDarker}`,
    transform: `scale(1.02)`,
  }
  /**
   * # MOUSEDOWN_STYLE
   */
  const MOUSEDOWN_STYLE = {
    boxShadow: `0px 17px 65px -17px ${Colors.blackDarker}`,
    transform: `scale(1.05)`,
  }

  const [springs, set] = useSprings(posts.length, index => {
    console.log("springs:index", index)

    return {
      from: { ...FROM_STYLE },
      to: { ...FROM_STYLE },
      config: config.wobbly,
    }
  })

  /**
   * updateStyles
   * - logging `idx` logs all the indices
   * - if the hovered index ===
   */
  const updateStyles = (index, stylesObject) => e => {
    set(idx => {
      return idx === index && { ...stylesObject }
    })
  }

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" keywords={KEYWORDS} />
      <Bio />

      <Grid container direction="row" spacing={4}>
        {springs.map((props, index, propsArray) => {
          console.log("propsArray[index]", propsArray[index])
          console.log("props", props)
          const { node } = posts[index]
          const title =
            node.internal.type === `MarkdownRemark` &&
            (node.frontmatter.title || node.fields.slug)

          return node.internal.type === `MarkdownRemark` ? (
            <Post
              key={node.fields.slug}
              linkTo={node.fields.slug}
              date={node.frontmatter.date}
              title={title}
              description={node.frontmatter.description}
              excerpt={node.excerpt}
              tags={node.frontmatter.tags}
              origin={location.origin}
              id={node.id}
              image={node.frontmatter.image}
              index={index}
              nodeType={node.internal.type}
              animatedStyles={{ ...props }}
              _handleMouseEnter={updateStyles(index, MOUSEOVER_STYLE)}
              _handleMouseLeave={updateStyles(index, FROM_STYLE)}
              _handleMouseDown={updateStyles(index, MOUSEDOWN_STYLE)}
              _handleMouseUp={updateStyles(index, MOUSEOVER_STYLE)}
            />
          ) : (
            /**
             * else if (node.internal.type === `ContentfulBlogPost`)
             **/
            <Post
              key={node.slug}
              linkTo={node.slug}
              date={node.date}
              title={node.title}
              description={node.description}
              // excerpt={node.excerpt}
              tags={node.tags}
              // origin={location.origin}
              id={node.id}
              image={node.image}
              index={index}
              nodeType={node.internal.type}
              animatedStyles={{ ...props }}
              _handleMouseEnter={updateStyles(index, MOUSEOVER_STYLE)}
              _handleMouseLeave={updateStyles(index, FROM_STYLE)}
              _handleMouseDown={updateStyles(index, MOUSEDOWN_STYLE)}
              _handleMouseUp={updateStyles(index, MOUSEOVER_STYLE)}
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
