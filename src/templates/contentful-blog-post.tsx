import * as React from "react"
import { Link, graphql } from "gatsby"
import kebabCase from "lodash/kebabCase"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "@src/utils/typography"
import { Discussion } from "@src/components/TemplateComponents"

import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { BLOCKS } from "@contentful/rich-text-types"

export default function ContentfulBlogPostTemplate({
  data,
  pageContext,
  location,
}) {
  const post = data.contentfulBlogPost
  const { title: siteTitle } = data.site.siteMetadata
  const { previous, next } = pageContext

  /**
   * Arguments to pass to: documentToReactComponents(document, options)
   * https://github.com/contentful/rich-text/tree/master/packages/rich-text-react-renderer
   **/
  const document: JSON = post.body.json
  const options = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: node => {
        // console.log(node)
        let { file, title, description } = node.data.target.fields
        // console.log(file["en-US"].url)
        return <img src={file["en-US"].url} alt={description["en-US"]} />
      },
    },
  }
  // console.log(documentToReactComponents(document, options))

  return (
    <Layout location={location} title={siteTitle}>
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
       * NOTE: replace this div with documentToReactComponents()
       * It converts Contenful's "rich text" (post.body.json)
       * to react components.
       *
       * <div dangerouslySetInnerHTML={{ __html: post.html }} />
       **/}
      {documentToReactComponents(document, options)}

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

      <Discussion
        locationPathname={location.pathname}
        identifier={post.id}
        title={post.title}
      />
    </Layout>
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
