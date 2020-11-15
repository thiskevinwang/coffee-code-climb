import React, { memo } from "react"
import { graphql, useStaticQuery } from "gatsby"
import Image from "gatsby-image"
import type { FixedObject } from "gatsby-image"
import { rhythm } from "src/utils/typography"

function Bio() {
  const data = useStaticQuery<Data>(bioQuery)
  const { author, social } = data.site.siteMetadata
  return (
    <div
      className={"bio"}
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
        <a
          href={`https://twitter.com/${social.twitter}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {author}
        </a>
        .
        <br />
        🎓 New School for Jazz '13
        <br />
        <>💻 Software Engineer</>
        <br />
        🧗🏻‍♂️ Rock Climber
      </p>
    </div>
  )
}

interface Data {
  avatar: {
    childImageSharp: {
      fixed: FixedObject
    }
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

export default memo(Bio)
