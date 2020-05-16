import * as React from "react"
import { Link, graphql } from "gatsby"
import _ from "lodash"
import styled from "styled-components"
import theme from "styled-theming"
import { animated } from "react-spring"

// Components
import Bio from "components/bio"
import SEO from "components/seo"
import { TableOfContents } from "components/TableOfContents"
import { LayoutManager } from "components/layoutManager"
import { PrevNextNavigation } from "components/TemplateComponents"
import { CreateComment } from "components/Comments/Create"
import { CommentsByUrl } from "components/Comments/Display/ByUrl"

// Other
import { rhythm, scale } from "utils/typography"
import * as Colors from "consts/Colors"

export const Hr = styled(animated.div)`
  min-height: 1px;
  margin-bottom: 2px;
  background: ${theme("mode", {
    light: Colors.greyLighter,
    dark: Colors.greyDarker,
  })};
`

export default function BlogPostTemplate({ data, pageContext, location }) {
  const post = data.markdownRemark
  const { title: siteTitle } = data.site.siteMetadata
  const { previous, next, postTitle, tableOfContents } = pageContext

  return (
    <LayoutManager location={location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />

      {
        /** only Markdown pages have tableOfContents*/
        tableOfContents && (
          <TableOfContents title={postTitle} __html={tableOfContents} />
        )
      }
      <h1>{post.frontmatter.title}</h1>
      <p
        style={{
          ...scale(-1 / 5),
          display: `block`,
          marginBottom: rhythm(1),
          marginTop: rhythm(-1),
        }}
      >
        {post.frontmatter.date}
      </p>

      <div dangerouslySetInnerHTML={{ __html: post.html }} />

      <small>
        Tags:{" "}
        {post.frontmatter.tags.map((tag, index) => (
          <Link
            to={`/tags/${_.kebabCase(tag)}/`}
            style={{ color: "#A6B1BB", margin: 3 }}
            key={index}
          >
            {tag}
          </Link>
        ))}
      </small>
      <hr
        style={{
          marginBottom: rhythm(1),
        }}
      />
      <Bio />

      <PrevNextNavigation previous={previous} next={next} />
      <Hr />
      <h3>Comments</h3>
      <CreateComment url={location.pathname} />
      <CommentsByUrl url={location.pathname} />
    </LayoutManager>
  )
}

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        tags
      }
    }
  }
`
