import React from "react"
import { Link, graphql } from "gatsby"
import auth from "../utils/auth"

import Bio from "../components/bio"
import Layout from "../components/layout"
import CircularProgress from "@material-ui/core/CircularProgress"

class Callback extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    auth.handleAuthentication()
    return (
      <Layout location={this.props.location} title={siteTitle}>
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
          }}
        >
          <CircularProgress />
        </div>
      </Layout>
    )
  }
}

export default Callback

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            tags
          }
        }
      }
    }
  }
`
