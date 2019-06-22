import React from "react"
import { useSelector } from "react-redux"
import PropTypes from "prop-types"
import styled from "styled-components"

// Utilities
import kebabCase from "lodash/kebabCase"
import { rhythm } from "@src/utils/typography"
import { combineTagGroups } from "@src/utils/combineTagGroups"

// Components
import { Link, graphql } from "gatsby"
import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"

const black = `rgba(20,20,20,0.8)`

const StyledLi = styled.li`
  display: flex;
  align-items: center;
  background: ${props => (props.isDarkMode ? black : "white")};
  border: ${props =>
    props.isDarkMode ? `1px solid white` : `1px solid ${black}`};
  border-radius: 3px;
  a {
    color: ${props => (props.isDarkMode ? "white" : black)};
    box-shadow: none;
  }
  padding: ${rhythm(0.3)} ${rhythm(1)};
  margin: ${rhythm(1 / 4)};
  list-style-type: none;
  transition: all 322ms ease-in-out;

  :hover {
    transform: scale(1.1);
  }
`
const StyledUl = styled.ul`
  display: flex;
  flex-flow: row wrap;
  @media screen and (max-width: 1000px) {
    columns: 4;
  }
  @media screen and (max-width: 800px) {
    columns: 3;
  }
`

let currentLetter = ``

const TagsPage = ({
  data: {
    allMarkdownRemark: { group: group1 },
    allContentfulBlogPost: { group: group2 },
    site: {
      siteMetadata: { title },
    },
  },
  location,
}) => {
  let group = combineTagGroups(group1, group2)
  const isDarkMode = useSelector(state => state.isDarkMode)

  return (
    <Layout location={location} title={title}>
      <SEO title={title} />

      <h2>{`Tags (${group.length})`}</h2>
      <hr />

      <StyledUl>
        {group.map(tag => {
          const { fieldValue, totalCount } = tag
          const firstLetter = fieldValue.charAt(0).toLowerCase()
          const buildTag = (
            <StyledLi
              item
              key={fieldValue}
              isDarkMode={isDarkMode}
              style={{ fontSize: `${100 + 10 * totalCount}%` }}
            >
              <Link to={`/tags/${kebabCase(tag.fieldValue)}/`}>
                {fieldValue} ({totalCount})
              </Link>
            </StyledLi>
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
      </StyledUl>

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
    allContentfulBlogPost(limit: 2000) {
      group(field: tags) {
        fieldValue
        totalCount
      }
    }
  }
`
