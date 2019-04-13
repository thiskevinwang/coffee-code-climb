/**
 * Bio component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import { StaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

import { rhythm } from "@src/utils/typography"

interface Data {
  avatar: {
    childImageSharp: any
  }
  site: {
    siteMetadata: {
      author: string
      social: {
        twitter: string
      }
    }
  }
}

function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={(data: Data) => {
        const { author, social } = data.site.siteMetadata
        return (
          <div
            style={{
              display: `flex`,
              marginBottom: rhythm(2.5),
            }}
          >
            <Image
              fixed={data.avatar.childImageSharp.fixed}
              alt={author}
              style={{
                marginRight: rhythm(1 / 2),
                marginBottom: 0,
                minWidth: 50,
                borderRadius: `100%`,
              }}
              imgStyle={{
                borderRadius: `50%`,
              }}
            />
            <p>
              A blog by{" "}
              <strong>
                <a href={`https://twitter.com/${social.twitter}`}>{author}</a>
              </strong>
              .{" "}
              <i>
                Jazz Guitarist → Barista → Healthcare Startup Potato → Rock
                Climber → Programmer → ?
              </i>
            </p>
          </div>
        )
      }}
    />
  )
}

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/kevin.jpg/" }) {
      childImageSharp {
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        social {
          twitter
        }
      }
    }
  }
`

export default Bio