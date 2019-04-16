import React from "react"
import { Link, graphql } from "gatsby"
import Image from "gatsby-image"
import { CommentCount } from "disqus-react"
import { Grid } from "@material-ui/core"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "@src/utils/typography"

// Tools
import includes from "lodash/includes"
import kebabCase from "lodash/kebabCase"
import map from "lodash/map"

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

type Props = {
  key: string,
  linkTo: string,
  date: string,
  title: string,
  description: string,
  excerpt: string,
  tags: Array<string>,
}

function Post({
  key,
  linkTo,
  date,
  title,
  description,
  excerpt,
  tags,
  origin,
  id,
  image,
  index,
}: Props) {
  //_.map + _.kebabCase each tag in frontmatter.tags
  let kebabTags = map(tags, tag => kebabCase(tag))

  const disqusShortname = "coffeecodeclimb"
  const disqusConfig = {
    url: "https://coffeecodeclimb.com" + linkTo,
    identifier: id,
    title: title,
  }

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
            fluid={image.childImageSharp.fluid}
            alt={linkTo}
            style={{}}
            imgStyle={{}}
          />
        )}
      </Link>
      <h3
        style={{
          marginTop: rhythm(1 / 2),
          marginBottom: rhythm(1 / 4),
        }}
      >
        <Link style={{ boxShadow: `none` }} to={linkTo}>
          {title}
        </Link>
      </h3>
      <small>{date}</small>
      <br />
      <small
        style={{ color: "#425A70" }}
        dangerouslySetInnerHTML={{
          __html: description || excerpt,
        }}
      />
      <br />
      {includes(kebabTags, "coffee") && "☕️"}
      {includes(kebabTags, "code") && "💻"}
      {includes(kebabTags, "climbing") && "🧗🏻‍♂️"}{" "}
      <code>
        <small>
          <CommentCount shortname={disqusShortname} config={disqusConfig}>
            Comments
          </CommentCount>
        </small>
      </code>
    </Grid>
  )
}

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="All posts" keywords={KEYWORDS} />
        <Bio />
        <Grid container direction="row" spacing={24}>
          {posts.map(({ node }, index) => {
            const title = node.frontmatter.title || node.fields.slug
            return (
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
                fluid(maxWidth: 2000, maxHeight: 1000) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
          id
        }
      }
    }
  }
`
