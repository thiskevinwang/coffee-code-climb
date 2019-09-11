/**
 * Bio component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React, { memo } from "react"
import { StaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import { Tooltip } from "@material-ui/core"
import { rhythm } from "src/utils/typography"

import CapsuleSvg from "./capsule.svg.tsx"

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
              👋 I'm{" "}
              <a href={`https://twitter.com/${social.twitter}`}>{author}</a>.{" "}
              <span>
                <s>Jazz Guitarist</s> → <s>Barista</s> → <s>Receptionist</s> →{" "}
                <Tooltip
                  title={
                    <div style={{ width: 60, height: 60, padding: 10 }}>
                      <CapsuleSvg />
                    </div>
                  }
                >
                  <u>Front End Engineer</u>
                </Tooltip>
              </span>
              <br />
              This is my ever growing sandbox of sorts⛱.
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

// memo() here prevents a rerender when some other
// component's window resize handler updates state
// and causes a hgue rerender
export default memo(Bio)
