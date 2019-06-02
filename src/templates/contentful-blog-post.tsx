import React, { useState } from "react"
import { Link, graphql } from "gatsby"
import kebabCase from "lodash/kebabCase"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "@src/utils/typography"
import {
  // Discussion,
  DocumentToReactComponents,
  PrevNextNavigation,
} from "@src/components/TemplateComponents"

export default function ContentfulBlogPostTemplate({
  data,
  pageContext,
  location,
}) {
  const post = data.contentfulBlogPost
  const { title: siteTitle } = data.site.siteMetadata
  const { previous, next } = pageContext

  const [gradient, setGradient] = useState()

  return (
    <Layout
      location={location}
      title={siteTitle}
      handleGradientChange={value => {
        setGradient(value)
      }}
    >
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

      <PrevNextNavigation
        previous={previous}
        next={next}
        nextGradient={gradient}
      />

      {/* <Discussion
        locationPathname={location.pathname}
        identifier={post.id}
        title={post.title}
      /> */}
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
