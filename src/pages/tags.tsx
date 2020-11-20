import React from "react"
import styled from "styled-components"
import { Link, graphql, PageProps } from "gatsby"
import kebabCase from "lodash/kebabCase"

import { rhythm } from "utils/typography"
import { combineTagGroups } from "utils/combineTagGroups"
import Bio from "components/bio"
import { LayoutManager } from "components/layoutManager"
import SEO from "components/seo"

import { Tag } from "components/Posts/V1"

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
}: PageProps<QueryData>) => {
  let group = combineTagGroups(group1, group2)

  return (
    <LayoutManager location={location}>
      <SEO title={title} />

      <h2>{`Tags (${group.length})`}</h2>
      <hr />

      <StyledUl>
        {group.map((tag) => {
          const { fieldValue, totalCount } = tag
          const firstLetter = fieldValue.charAt(0).toLowerCase()
          const buildTag = (
            <Tag key={fieldValue}>
              <Link to={`/tags/${kebabCase(tag.fieldValue)}/`}>
                {fieldValue} ({totalCount})
              </Link>
            </Tag>
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
    </LayoutManager>
  )
}

interface QueryData {
  allMarkdownRemark: {
    group: {
      fieldValue: string
      totalCount: number
    }[]
  }
  allContentfulBlogPost: {
    group: {
      fieldValue: string
      totalCount: number
    }[]
  }
  site: {
    siteMetadata: {
      title: string
    }
  }
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
