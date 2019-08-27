const path = require(`path`)
const _ = require("lodash")
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve("src/templates/blog-post.tsx")
  const contentfulBlogPost = path.resolve(
    "src/templates/contentful-blog-post.tsx"
  )
  const tagTemplate = path.resolve("src/templates/tags.tsx")

  return graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              internal {
                type
              }
              fields {
                slug
              }
              frontmatter {
                title
                tags
                date
              }
            }
          }
        }
        allContentfulBlogPost(
          sort: { fields: [date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              internal {
                type
              }
              slug
              title
              tags
              date
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    // Create blog posts pages.
    const markdownPosts = result.data.allMarkdownRemark.edges
    const contentfulPosts = result.data.allContentfulBlogPost.edges

    /**
     * Combine Markdown & Contentful posts. Sort by newest Date.
     */
    const posts = _.sortBy(
      _.union(contentfulPosts, markdownPosts),
      ({ node }) => {
        let date = new Date(
          node.internal.type === `MarkdownRemark`
            ? node.frontmatter.date
            : node.date
        )

        return -date
      }
    )

    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node

      /**
       * type = `MarkdownRemark` || `ContentfulBlogPost`
       **/
      const { type } = post.node.internal

      if (type === `MarkdownRemark`) {
        createPage({
          path: post.node.fields.slug,
          component: blogPost,
          context: {
            slug: post.node.fields.slug,
            previous,
            next,
          },
        })
      } else if (type === `ContentfulBlogPost`) {
        createPage({
          path: post.node.slug,
          component: contentfulBlogPost,
          context: {
            slug: post.node.slug,
            previous,
            next,
          },
        })
      }
    })

    // Tag pages:
    let tags = []
    // Iterate through each post, putting all found tags into `tags`
    _.each(posts, edge => {
      if (_.get(edge, "node.frontmatter.tags")) {
        tags = tags.concat(edge.node.frontmatter.tags)
      }
    })

    // Contentful tags:
    _.each(contentfulPosts, edge => {
      if (_.get(edge, "node.tags")) {
        tags = tags.concat(edge.node.tags)
      }
    })

    // Eliminate duplicate tags
    tags = _.uniq(tags)

    // Make tag pages
    tags.forEach(tag => {
      createPage({
        path: `/tags/${_.kebabCase(tag)}/`,
        component: tagTemplate,
        context: {
          tag,
        },
      })
    })

    return null
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
  // if (node.internal.type === `ContentfulBlogPost`) {
  //   const value = createFilePath({ node, getNode })
  //   createNodeField({
  //     name: `slug`,
  //     node,
  //     value,
  //   })
  // }
}

/**
 * Fixes Warning:
 * React-Hot-Loader: react-🔥-dom patch is not detected. React 16.6+ features may not work.
 *
 * yarn add -D @hot-loader/react-dom
 * @see https://github.com/gatsbyjs/gatsby/issues/11934#issuecomment-469046186
 */
exports.onCreateWebpackConfig = ({ getConfig, stage }) => {
  const config = getConfig()
  if (stage.startsWith("develop") && config.resolve) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "react-dom": "@hot-loader/react-dom",
    }
  }
}
