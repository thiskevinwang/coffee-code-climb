import React from "react"
import { useSelector } from "react-redux"
import _ from "lodash"
import moment from "moment"
import styled from "styled-components"
import { animated } from "react-spring"

import * as Posts from "components/Posts"

const CSSGrid = styled(animated.div)`
  display: grid;

  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  /* grid-template-rows: repeat(auto-fill, minmax(9%, 1fr)); */
  /* grid-auto-rows: auto-fill; */
  /* grid-template-rows: 25% 100px auto; */

  row-gap: 10px;
  column-gap: 10px;
`

const checkIsMarkdownRemark = node => node.internal.type === `MarkdownRemark`
const checkIsContentfulBlogPost = node =>
  node.internal.type === `ContentfulBlogPost`

const PostsManager = ({ allPosts, location }) => {
  const postsVersion = useSelector(state => state.postsVersion)
  /**
   * Combine Markdown & Contentful posts. Sort by newest Date.
   */
  const posts = _.sortBy(allPosts, ({ node }) => {
    let date = moment(
      node.internal.type === `MarkdownRemark`
        ? node.frontmatter.date
        : node.date
    )
    return -date
  })

  if (postsVersion === 1) {
    /**
     * postsVersion-2 can scroll quite deep, and when toggling versions,
     * the `scrollTop` value is persisted.
     *
     * As a courtesy, scroll the window back to the top.
     */
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    })
    return (
      <CSSGrid>
        {posts.map(({ node }, index) => {
          const isMarkdownRemark = checkIsMarkdownRemark(node)
          const isContentfulBlogPost = checkIsContentfulBlogPost(node)

          const title =
            node.internal.type === `MarkdownRemark` &&
            (node.frontmatter.title || node.fields.slug)

          return (
            <Posts.V1
              key={isMarkdownRemark ? node.fields.slug : node.slug}
              linkTo={isMarkdownRemark ? node.fields.slug : node.slug}
              date={isMarkdownRemark ? node.frontmatter.date : node.date}
              title={isMarkdownRemark ? title : node.title}
              description={
                isMarkdownRemark
                  ? node.frontmatter.description
                  : node.description
              }
              excerpt={isMarkdownRemark ? node.excerpt : null}
              tags={isMarkdownRemark ? node.frontmatter.tags : node.tags}
              origin={isMarkdownRemark ? location.origin : null}
              id={node.id}
              image={isMarkdownRemark ? node.frontmatter.image : node.image}
              index={index}
              nodeType={node.internal.type}
            />
          )
        })}
      </CSSGrid>
    )
  }
  if (postsVersion === 2)
    return posts.map(({ node }, index) => {
      const isMarkdownRemark = checkIsMarkdownRemark(node)
      const isContentfulBlogPost = checkIsContentfulBlogPost(node)

      const title =
        node.internal.type === `MarkdownRemark` &&
        (node.frontmatter.title || node.fields.slug)

      return (
        <Posts.V2
          key={isMarkdownRemark ? node.fields.slug : node.slug}
          linkTo={isMarkdownRemark ? node.fields.slug : node.slug}
          date={isMarkdownRemark ? node.frontmatter.date : node.date}
          title={isMarkdownRemark ? title : node.title}
          description={
            isMarkdownRemark ? node.frontmatter.description : node.description
          }
          excerpt={isMarkdownRemark ? node.excerpt : null}
          tags={isMarkdownRemark ? node.frontmatter.tags : node.tags}
          origin={isMarkdownRemark ? location.origin : null}
          id={node.id}
          image={isMarkdownRemark ? node.frontmatter.image : node.image}
          index={index}
          nodeType={node.internal.type}
        />
      )
    })
  return null
}

export { PostsManager }
