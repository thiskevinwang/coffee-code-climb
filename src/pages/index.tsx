import React, { useState, useEffect } from "react"
import _ from "lodash"
import moment from "moment"
import { Link, graphql } from "gatsby"
import Image from "gatsby-image"
import { CommentCount } from "disqus-react"
import { Grid, Divider, Tooltip } from "@material-ui/core"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "src/utils/typography"

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
  innerWidth: number
  nodeType: string
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
  innerWidth,
  nodeType,
}: Props) {
  //_.map + _.kebabCase each tag in frontmatter.tags
  let kebabTags = _.map(tags, tag => _.kebabCase(tag))

  const disqusShortname = "coffeecodeclimb"
  const disqusConfig = {
    url: "https://coffeecodeclimb.com" + linkTo,
    identifier: id,
    title: title,
  }

  const PostDetails = (
    <>
      <Link style={{ color: `inherit`, boxShadow: `none` }} to={linkTo}>
        <h3
          style={{
            marginTop: rhythm(1 / 2),
            marginBottom: rhythm(1 / 4),
          }}
        >
          {title}
        </h3>
        <small>{date}</small>
        <br />
        <small
          style={{ color: "#425A70" }}
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
    </>
  )

  const PostDetailsTop = (
    <div
      className={"post-details__card"}
      style={{
        background: innerWidth >= 600 ? "white" : `none`,
        paddingTop: innerWidth >= 600 && rhythm(1 / 2),
        paddingBottom: innerWidth >= 600 && rhythm(1),
        paddingLeft: innerWidth >= 600 && rhythm(1),
        paddingRight: innerWidth >= 600 && rhythm(1),
        maxWidth: rhythm(18),
        transform:
          innerWidth >= 600 ? `translate(${rhythm(1)}, -${rhythm(2)})` : `none`,
      }}
    >
      {PostDetails}
      <style>{`
        .post-details__card {
          transition: box-shadow 100ms ease-in-out, transform 322ms ease-in-out,
            background 322ms ease-in-out, padding-left 322ms ease-in-out;
        }
      `}</style>
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
      {index === 0 ? PostDetailsTop : PostDetails}
      {index === 0 && innerWidth >= 600 && <Divider />}
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

  const [state, setState] = useState({ innerWidth: 0 })

  const handleResize = _.throttle(() => {
    setState({
      innerWidth: window.innerWidth,
    })
  }, 100)

  // Attach resize handler on mount
  useEffect(() => {
    setState({
      innerWidth: window.innerWidth,
    })
    window.addEventListener("resize", handleResize)
  }, [])

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

      <Grid container direction="row" spacing={3}>
        {posts.map(({ node }, index) => {
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
              innerWidth={state.innerWidth}
              nodeType={node.internal.type}
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
              innerWidth={state.innerWidth}
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
