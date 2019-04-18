import React from "react"
import { Link } from "gatsby"
import { rhythm, scale } from "@src/utils/typography"

export default function Header({
  location,
  title,
}: {
  location: Location
  title: string
}) {
  const rootPath: string = `${__PATH_PREFIX__}/`
  let header: JSX.Element

  const titleLink: JSX.Element = (
    <Link
      style={{
        boxShadow: `none`,
        textDecoration: `none`,
        color: `inherit`,
      }}
      to={`/`}
    >
      {title}
    </Link>
  )

  if (location.pathname === rootPath) {
    header = (
      <h1
        style={{
          ...scale(1.5),
          marginBottom: rhythm(1),
        }}
      >
        {titleLink}
      </h1>
    )
  } else {
    header = (
      <h3
        style={{
          fontFamily: `Montserrat, sans-serif`,
        }}
      >
        {titleLink}
      </h3>
    )
  }
  return header
}
