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
              tableOfContents
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
                image {
                  publicURL
                }
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
  ).then((result) => {
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
        // Some posts are missing `image` frontmatter
        const image = post.node.frontmatter.image
        const imagePublicURL = image ? image.publicURL : null

        createPage({
          path: post.node.fields.slug,
          component: blogPost,
          context: {
            slug: post.node.fields.slug,
            previous,
            next,
            postTitle: post.node.frontmatter.title,
            tableOfContents: post.node.tableOfContents,
            imagePublicURL,
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
    _.each(posts, (edge) => {
      if (_.get(edge, "node.frontmatter.tags")) {
        tags = tags.concat(edge.node.frontmatter.tags)
      }
    })

    // Contentful tags:
    _.each(contentfulPosts, (edge) => {
      if (_.get(edge, "node.tags")) {
        tags = tags.concat(edge.node.tags)
      }
    })

    // Eliminate duplicate tags
    tags = _.uniq(tags)

    // Make tag pages
    tags.forEach((tag) => {
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

// https://www.gatsbyjs.com/tutorial/authentication-tutorial/
// Implement the Gatsby API “onCreatePage”. This is
// called after every page is created.
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions
  // page.matchPath is a special key that's used for matching pages
  // only on the client.
  if (page.path.match(/^\/app/)) {
    page.matchPath = "/app/*"
    // Update the page.
    createPage(page)
  }

  if (page.path.match(/^\/u/)) {
    page.matchPath = "/u/*"
    // Update the page.
    createPage(page)
  }
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
exports.onCreateWebpackConfig = ({ getConfig, stage, actions }) => {
  const config = getConfig()
  if (stage.startsWith("develop") && config.resolve) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "react-dom": "@hot-loader/react-dom",
    }
  }
  /**
   * Fixing a jwks-rsa error
   * - 'Can't resolve 'tls' in '/Users/kevin/repos/coffee-code-climb/node_modules/https-proxy-agent/dist'
   *
   * @see https://github.com/auth0/node-jwks-rsa/issues/48
   * @see https://github.com/gatsbyjs/gatsby/issues/21500
   */
  actions.setWebpackConfig({
    node: {
      fs: "empty",
      tls: "empty",
      net: "empty",
    },
  })
}
