import React from "react"
import { Link, graphql } from "gatsby"
import Image from "gatsby-image"
import { CommentCount } from "disqus-react"
import { Grid, Divider, Tooltip } from "@material-ui/core"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "@src/utils/typography"

// Tools
import union from "lodash/union"
import sortBy from "lodash/sortBy"
import includes from "lodash/includes"
import kebabCase from "lodash/kebabCase"
import map from "lodash/map"
import throttle from "lodash/throttle"

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
  key,
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
  let kebabTags = map(tags, tag => kebabCase(tag))

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
      {includes(kebabTags, "coffee") && (
        <Tooltip title={`tagged with "coffee"`}>
          <Link style={{ boxShadow: `none` }} to={"/tags/coffee/"}>
            <span role="img" aria-label="tagged with coffee">
              ☕️
            </span>
          </Link>
        </Tooltip>
      )}
      {includes(kebabTags, "code") && (
        <Tooltip title={`tagged with "code"`}>
          <Link style={{ boxShadow: `none` }} to={"/tags/code/"}>
            <span role="img" aria-label="tagged with code">
              💻
            </span>
          </Link>
        </Tooltip>
      )}
      {includes(kebabTags, "climbing") && (
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
      <style jsx>{`
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

class BlogIndex extends React.Component {
  state = {
    innerWidth: 0,
  }

  handleResize = throttle(() => {
    this.setState({
      innerWidth: window.innerWidth,
    })
  }, 100)

  componentDidMount() {
    this.setState({
      innerWidth: window.innerWidth,
    })
    window.addEventListener("resize", this.handleResize)
  }
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title

    const markdownPosts = data.allMarkdownRemark.edges
    const contentfulPosts = data.allContentfulBlogPost.edges

    /**
     * Combine Markdown & Contentful posts. Sort by newest Date.
     */
    const posts = sortBy(union(contentfulPosts, markdownPosts), ({ node }) => {
      let date = new Date(
        node.internal.type === `MarkdownRemark`
          ? node.frontmatter.date
          : node.date
      )
      return -date
    })

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="All posts" keywords={KEYWORDS} />
        <Bio />

        <Grid container direction="row" spacing={24}>
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
                origin={this.props.location.origin}
                id={node.id}
                image={node.frontmatter.image}
                index={index}
                innerWidth={this.state.innerWidth}
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
                // origin={this.props.location.origin}
                id={node.id}
                image={node.image}
                index={index}
                innerWidth={this.state.innerWidth}
                nodeType={node.internal.type}
              />
            )
          })}
        </Grid>
      </Layout>
    )
  }
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
