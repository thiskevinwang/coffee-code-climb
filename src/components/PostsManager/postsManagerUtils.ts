import _ from "lodash"

export const checkIsMarkdownRemark = (node: any) =>
  node.internal.type === `MarkdownRemark`

// contentful nodes don't have `.id`
export const checkIsContentfulBlogPost = (node: any) =>
  node.internal.type === `ContentfulBlogPost`

/**
 * Combine Markdown & Contentful posts. Sort by newest Date.
 *
 * This is our source of truth that should never be mutated
 */
export const generatePosts = (posts: any[]) => {
  const dateSorted = _.sortBy(posts, ({ node }) => {
    let date = new Date(
      node.internal.type === `MarkdownRemark`
        ? node.frontmatter.date
        : node.date
    )
    return -date
  })
  return dateSorted
}
