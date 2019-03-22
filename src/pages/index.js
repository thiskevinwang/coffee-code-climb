import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"

const KEYWORDS = [
  `blog`,
  `gatsby`,
  `javascript`,
  `react`,
  `coffee`,
  `coding`,
  `climbing`,
  `flow`,
  `kevin wang`,
  `graphql`,
  `apollo`,
  `node`,
  `nextjs`,
]

function Post({ key, linkTo, date, title, description, excerpt, isDraft }) {
  return (
    <>
      <h3
        style={{
          marginBottom: rhythm(1 / 4),
        }}
      >
        <Link style={{ boxShadow: `none` }} to={linkTo}>
          {isDraft && <code>draft</code>} {title}
        </Link>
      </h3>
      <small>{date}</small>
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
            <>
              <Post
                key={node.fields.slug}
                linkTo={node.fields.slug}
                date={node.frontmatter.date}
                title={title}
                description={node.frontmatter.description}
                excerpt={node.excerpt}
                isDraft={node.frontmatter.isDraft || null}
              />
            </>
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
          }
        }
      }
    }
  }
`
