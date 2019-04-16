import React from "react"
import { Link, graphql } from "gatsby"
import Image from "gatsby-image"
import { CommentCount } from "disqus-react"

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
    <>
      {image && (
        <Image
          fixed={image.childImageSharp.fixed}
          alt={"foobar"}
          style={{
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            minWidth: 50,
          }}
          imgStyle={{}}
        />
      )}
      <h3
        style={{
          marginBottom: rhythm(1 / 4),
        }}
      >
        <Link style={{ boxShadow: `none` }} to={linkTo}>
          {title} {includes(kebabTags, "coffee") && "☕️"}
          {includes(kebabTags, "code") && "💻"}
          {includes(kebabTags, "climbing") && "🧗🏻‍♂️"}
        </Link>
      </h3>
      <small>{date}</small>{" "}
      <code>
        <small>
          <CommentCount shortname={disqusShortname} config={disqusConfig}>
            Comments
          </CommentCount>
        </small>
      </code>
      <p
        dangerouslySetInnerHTML={{
          __html: description || excerpt,
        }}
      />
    </>
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
        {posts.map(({ node }) => {
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
            />
          )
        })}
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
                fixed(width: 500, height: 200) {
                  ...GatsbyImageSharpFixed
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
