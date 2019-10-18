import React from "react"
import { useSelector, useDispatch } from "react-redux"
import _ from "lodash"
import moment from "moment"
import { Grid } from "@material-ui/core"

import * as Posts from "components/Posts"

const checkIsMarkdownRemark = node => node.internal.type === `MarkdownRemark`
const checkIsContentfulBlogPost = node =>
  node.internal.type === `ContentfulBlogPost`

const PostsManager = ({ allPosts, location }) => {
  const showBlogImage: boolean = useSelector(state => state.showBlogImage)
  const postsVersion: 1 | 2 | 3 = useSelector(state => state.postsVersion)
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
  if (postsVersion === 1)
    return (
      <Grid container direction="row" spacing={4}>
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
              showBlogImage={showBlogImage}
            />
          )
        })}
      </Grid>
    )
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
          showBlogImage={showBlogImage}
        />
      )
    })
  return null
}

export { PostsManager }
