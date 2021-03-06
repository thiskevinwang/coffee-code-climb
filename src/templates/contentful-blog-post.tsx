import React from "react"
import { Link, graphql } from "gatsby"
import kebabCase from "lodash/kebabCase"

import Bio from "components/bio"
import Layout from "components/layout"
import { LayoutManager } from "components/layoutManager"
import SEO from "components/seo"
import {
  DocumentToReactComponents,
  PrevNextNavigation,
} from "components/TemplateComponents"
import { rhythm, scale } from "utils/typography"

export default function ContentfulBlogPostTemplate({
  data,
  pageContext,
  location,
}) {
  const post = data.contentfulBlogPost
  const { title: siteTitle } = data.site.siteMetadata
  const { previous, next } = pageContext

  return (
    <LayoutManager location={location} title={siteTitle}>
      <SEO title={post.title} description={post.description} />
      <h1>{post.title}</h1>

      <p
        style={{
          ...scale(-1 / 5),
          display: `block`,
          marginBottom: rhythm(1),
          marginTop: rhythm(-1),
        }}
      >
        {post.date}
      </p>

      {/**
       * <div dangerouslySetInnerHTML={{ __html: post.html }} />
       **/}
      <DocumentToReactComponents document={post.body.json} />

      <small>
        Tags:{" "}
        {post.tags.map((tag, index) => (
          <Link
            to={`/tags/${kebabCase(tag)}/`}
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
    </LayoutManager>
  )
}

export const pageQuery = graphql`
  query ContentfulBlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    # markdownRemark(fields: { slug: { eq: $slug } }) {
    #   id
    #   excerpt(pruneLength: 160)
    #   html
    #   frontmatter {
    #     title
    #     date(formatString: "MMMM DD, YYYY")
    #     description
    #     tags
    #   }
    # }
    contentfulBlogPost(slug: { eq: $slug }) {
      id
      body {
        json
      }
      title
      date(formatString: "MMMM DD, YYYY")
      description
      tags
    }
  }
`
