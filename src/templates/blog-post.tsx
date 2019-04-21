import React from "react"
import { Link, graphql } from "gatsby"
import kebabCase from "lodash/kebabCase"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "@src/utils/typography"
import { DiscussionEmbed } from "disqus-react"

export default function BlogPostTemplate(props) {
  const post = props.data.markdownRemark
  const siteTitle = props.data.site.siteMetadata.title
  const { previous, next } = props.pageContext

  const disqusShortname = "coffeecodeclimb"
  const disqusConfig = {
    url: "https://coffeecodeclimb.com" + props.location.pathname,
    identifier: post.id,
    title: post.frontmatter.title,
  }

  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
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

      <ul
        style={{
          display: `flex`,
          flexWrap: `wrap`,
          justifyContent: `space-between`,
          listStyle: `none`,
          padding: 0,
        }}
      >
        {/**
         * [previous|next].internal.type = `MarkdownRemark` || `ContentfulBlogPost`
         * slug & title need to be accessed slightly differently
         **/}
        <li>
          {previous && (
            <Link
              to={
                previous.internal.type === `MarkdownRemark`
                  ? previous.fields.slug
                  : previous.slug
              }
              rel="prev"
            >
              ←{" "}
              {previous.internal.type === `MarkdownRemark`
                ? previous.frontmatter.title
                : previous.title}
            </Link>
          )}
        </li>
        <li>
          {next && (
            <Link
              to={
                next.internal.type === `MarkdownRemark`
                  ? next.fields.slug
                  : next.slug
              }
              rel="next"
            >
              {next.internal.type === `MarkdownRemark`
                ? next.frontmatter.title
                : next.title}{" "}
              →
            </Link>
          )}
        </li>
      </ul>

      <h2>Discussion</h2>
      <div className="disqus">
        <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
      </div>
    </Layout>
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
