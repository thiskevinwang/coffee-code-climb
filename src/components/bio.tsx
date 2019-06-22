/**
 * Bio component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import { StaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import { Tooltip } from "@material-ui/core"
import { rhythm } from "src/utils/typography"

import CAPSULE from "./capsule.svg"

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
                marginTop: "auto",
                marginBottom: "auto",
                minWidth: 50,
                borderRadius: `100%`,
              }}
              imgStyle={{}}
            />
            <p style={{ marginTop: "auto", marginBottom: "auto" }}>
              A blog by{" "}
              <a href={`https://twitter.com/${social.twitter}`}>{author}</a>.{" "}
              <span>
                Jazz Guitarist → Barista → Healthcare Startup Potato → Rock
                Climber →{" "}
                <Tooltip
                  title={
                    <div style={{ width: 60, height: 60, padding: 10 }}>
                      <img src={CAPSULE} />
                    </div>
                  }
                >
                  <u>Front End Engineer</u>
                </Tooltip>
              </span>
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
