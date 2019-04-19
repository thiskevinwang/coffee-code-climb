import React from "react"
import PropTypes from "prop-types"

// Utilities
import kebabCase from "lodash/kebabCase"
import { rhythm } from "@src/utils/typography"

// Components
import { Helmet } from "react-helmet"
import { Link, graphql } from "gatsby"
import Bio from "../components/bio"
import Layout from "../components/layout"
// import SEO from "../components/seo"

let currentLetter = ``

const TagsPage = ({
  data: {
    allMarkdownRemark: { group },
    site: {
      siteMetadata: { title },
    },
  },
  location,
}) => {
  return (
    <Layout location={location} title={title}>
      <Helmet title={title} />

      <h2>{`Tags (${group.length})`}</h2>
      <hr />

      <ul
        style={{
          display: `flex`,
          flexFlow: `row wrap`,
          justifyContent: `start`,
          padding: 0,
          margin: 0,
        }}
      >
        {group.map(tag => {
          const firstLetter = tag.fieldValue.charAt(0).toLowerCase()
          const buildTag = (
            <li
              item
              style={{
                padding: `${rhythm(0)} ${rhythm(1)}`,
                margin: rhythm(1 / 4),
                listStyleType: `none`,
              }}
              key={tag.fieldValue}
            >
              <Link to={`/tags/${kebabCase(tag.fieldValue)}/`}>
                {tag.fieldValue} ({tag.totalCount})
              </Link>
            </li>
          )

          if (currentLetter !== firstLetter) {
            currentLetter = firstLetter
            return (
              <React.Fragment key={`letterheader-${currentLetter}`}>
                <h4 style={{ width: `100%`, flexBasis: `100%` }}>
                  {currentLetter.toUpperCase()}
                </h4>
                {buildTag}
              </React.Fragment>
            )
          }

          return buildTag
        })}
      </ul>

      <hr
        style={{
          marginBottom: rhythm(1),
        }}
      />
      <Bio />
    </Layout>
  )
}

TagsPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired
      ),
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    }),
  }),
}

export default TagsPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(limit: 2000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
