// @flow

import React, { useState, useEffect } from "react"
import { useSpring, animated } from "react-spring"
import { Link } from "gatsby"
// import MobileDrawer from "./MobileDrawer"
// import NavBar from "./NavBar"
import { MobileDrawer, NavBar } from "./LayoutComponents"

import { rhythm, scale } from "@src/utils/typography"
// import { isMobile } from "react-device-detect"

const DARK = "#DCC2FF"
const DARKER = "#B9B0E8"
const MID = "#CFD5FF"
const LIGHTER = "#B0C6E8"
const LIGHT = "#C2E9FF"
const styles = {
  bg1: {
    position: "fixed",
    top: 0,
    left: 0,
    height: `50%`,
    width: `100%`,
    background: `linear-gradient(150deg, ${DARK} 15%, ${DARKER} 35%, ${MID} 55%, ${LIGHTER} 70%, ${LIGHT} 94%)`,
    opacity: 0.7,
    transform: `skewY(-6deg)`,
    transformOrigin: `top left`,
    zIndex: -10,
  },
  dottedBackground: {
    position: "fixed",
    top: 0,
    right: 0,
    height: `100%`,
    width: `30%`,
    transform: `skewX(6deg)`,
    transformOrigin: `top right`,
  },
}

const dbgStyleTag = (
  <style jsx>{`
    .dotted-background {
      padding: 2.25em 1.6875em;
      background-image: -webkit-repeating-radial-gradient(
        center center,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0.2) 1px,
        transparent 1px,
        transparent 100%
      );
      background-image: -moz-repeating-radial-gradient(
        center center,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0.2) 1px,
        transparent 1px,
        transparent 100%
      );
      background-image: -ms-repeating-radial-gradient(
        center center,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0.2) 1px,
        transparent 1px,
        transparent 100%
      );
      background-image: repeating-radial-gradient(
        center center,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0.2) 1px,
        transparent 1px,
        transparent 100%
      );
      -webkit-background-size: 5px 5px;
      -moz-background-size: 5px 5px;
      background-size: 5px 5px;
    }
  `}</style>
)

type Props = {
  children: React$Node,
  location: Location,
  title: string,
}

export default function Layout({ location, title, children }: Props) {
  const rootPath: string = `${__PATH_PREFIX__}/`
  let header: React$Node

  // Hook for updating currentY state
  // This gets passed to NavBar's `pageYOffset` props
  const [currentY: number, setCurrentY: () => any] = useState(0)

  // Attach scroll event listener to window when <Layout /> mounts
  useEffect(() => {
    const handleScroll = () => {
      setCurrentY(window.pageYOffset)
    }
    typeof window !== "undefined" &&
      window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

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

  // Spring animation
  const { x } = useSpring({
    from: { x: 1 },
    x: typeof window !== "undefined" ? currentY / (window.innerHeight / 4) : 0,
  })
  // const props = useSpring({
  //   from: { transform: "translate3d(-30px,0px,0) scale(5)", opacity: 0 },
  //   to: {
  //     transform: "translate3d(0px,0,0) scale(1)",
  //     opacity: 1,
  //   },
  //   delay: 200,
  //   // onRest: e => {
  //   //   console.log("spring has finished")
  //   // },
  //   // onFrame: e => {
  //   //   console.log(e)
  //   // },
  // })

  return (
    <>
      <NavBar
        location={location}
        // TODO: refactor logic to cap opacity at 1
        opacity={
          typeof window !== "undefined"
            ? currentY / (window.innerHeight / 2) > 1
              ? 1
              : currentY / (window.innerHeight / 2)
            : 0
        }
      />
      <div style={{ overflowX: "hidden" }}>
        <span style={styles.bg1} />
        <span className={"dotted-background"} style={styles.dottedBackground}>
          {dbgStyleTag}
        </span>

        <div
          style={{
            marginLeft: `auto`,
            marginRight: `auto`,
            maxWidth: rhythm(24),
            padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
          }}
        >
          <animated.header
            style={{
              transform: x
                .interpolate({
                  range: [0, 1, 2],
                  output: [1, 3, 3],
                })
                .interpolate(x => `scale(${x})`),
              opacity: x
                .interpolate({
                  range: [0, 1, 2],
                  output: [1, 0, 0],
                })
                .interpolate(x => x),
            }}
          >
            {header}
          </animated.header>

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
            <a href="https://github.com/thiskevinwang/coffee-code-climb">
              Github
            </a>{" "}
            {process.env.NODE_ENV === "development" && (
              <>
                | <code>{new Date().toISOString()}</code>
              </>
            )}
            <div id={`amzn-assoc-ad-${process.env.GATSBY_AD_INSTANCE_ID}`} />
            <script
              async
              src={`//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=${
                process.env.GATSBY_AD_INSTANCE_ID
              }`}
            />
          </footer>
        </div>
      </div>
    </>
  )
}
