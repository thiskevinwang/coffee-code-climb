// @flow

import React from "react"
import { Link } from "gatsby"
import MobileDrawer from "./MobileDrawer"
import NavBar from "./NavBar"

import { rhythm, scale } from "@src/utils/typography"
import { isMobile } from "react-device-detect"

type Props = {
  children: React$Node,
  location: Location,
  title: string,
}

export default function Layout({ location, title, children }: Props) {
  const rootPath: string = `${__PATH_PREFIX__}/`
  let header: React$Node

  if (location.pathname === rootPath) {
    header = (
      <h1
        style={{
          ...scale(1.5),
          marginBottom: rhythm(1.5),
          marginTop: 0,
        }}
      >
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
      </h1>
    )
  } else {
    header = (
      <h3
        style={{
          fontFamily: `Montserrat, sans-serif`,
          marginTop: 0,
        }}
      >
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
      </h3>
    )
  }
  return (
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: rhythm(24),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
      }}
    >
      <NavBar location={location} />
      <header>{header}</header>
      <MobileDrawer
        style={{
          zIndex: 99,
          position: "fixed",
          right: 0,
          bottom: 0,
          marginRight: 30,
          marginBottom: 60,
        }}
      />
      <main>{children}</main>
      <footer>
        <a href="https://github.com/thiskevinwang/coffee-code-climb">Github</a>{" "}
        | <code>{new Date().toISOString()}</code>
        <div id={`amzn-assoc-ad-${process.env.GATSBY_AD_INSTANCE_ID}`} />
        <script
          async
          src={`//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=${
            process.env.GATSBY_AD_INSTANCE_ID
          }`}
        />
      </footer>
    </div>
  )
}
