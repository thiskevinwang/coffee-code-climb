import React, { useState, useEffect } from "react"
import { useSpring, animated } from "react-spring"
import { Link } from "gatsby"
// import MobileDrawer from "./MobileDrawer"
// import NavBar from "./NavBar"
import { MobileDrawer, NavBar, Footer } from "./LayoutComponents"
import { Paper } from "@material-ui/core"

import { rhythm, scale } from "@src/utils/typography"
import { isMobile } from "react-device-detect"

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
    // Removing this line fixes a UI issue when hard-refreshing on Chrome
    // background: `linear-gradient(150deg, ${DARK} 15%, ${DARKER} 35%, ${MID} 55%, ${LIGHTER} 70%, ${LIGHT} 94%)`,
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
    zIndex: -9,
  },
  draggableGlass: {
    width: 200,
    height: 200,
    // glass-like
    background: `linear-gradient(150deg, rgba(255,255,255,0.9) 15%, rgba(255,255,255,0.2) 35%, rgba(255,255,255,0.5) 55%, rgba(255,255,255,0.9) 70%, rgba(255,255,255,0.8) 94%)`,
    zIndex: 9999,
    position: "absolute",
    borderTop: `3px solid ${LIGHT}`,
    borderLeft: `3px solid ${LIGHTER}`,
    borderRight: `3px solid ${DARKER}`,
    borderBottom: `3px solid ${DARK}`,
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

/** http://usejsdoc.org/tags-param.html
 * @param {string} props.title data.site.siteMetadata.title from graphql-pageQuery
 * @param {Location} props.location Parent.props.location
 * @param {React$Node} props.children mapped posts, or markdown
 */

export default function Layout({ location, title, children }: Props) {
  const rootPath: string = `${__PATH_PREFIX__}/`
  let header: React$Node

  // Hook for updating currentY state
  // This gets passed to NavBar's `pageYOffset` props
  const [currentY: number, setCurrentY: () => any] = useState(0)
  // Hook for scrollPercent of the document
  // between 0...1
  const [scrollPercent: number, setScrollPercent: () => any] = useState(0)

  // Attach scroll event listener to window when <Layout /> mounts
  useEffect(() => {
    const handleScroll = () => {
      setCurrentY(window.pageYOffset)
      setScrollPercent(
        window.pageYOffset /
          (document.documentElement.scrollHeight - window.innerHeight)
      )
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
  // passed to animated.header style prop
  const { x } = useSpring({
    from: { x: 1 },
    x: typeof window !== "undefined" ? currentY / (window.innerHeight / 4) : 0,
  })

  // passed to animated.span (background) style prop
  const { _scrollPercent } = useSpring({
    from: { _scrollPercent: 1 },
    _scrollPercent: scrollPercent,
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

  const [d, setD] = useState({ x: -75, y: -75 })
  const [drag, toggleDrag] = useState(false)

  const { dX, dY } = useSpring({
    from: { dX: -100, dY: -100 },
    dX: typeof window !== "undefined" ? d.x : -75,
    dY: typeof window !== "undefined" ? d.y : -75,
    config: { mass: 1, tension: 250, friction: 10 },
  })

  // Wrap <Paper> in `animated` to work with `useSpring`
  const AnimatedPaper = animated(Paper)

  return (
    <>
      {!isMobile && (
        <AnimatedPaper
          className={`draggable-glass`}
          style={{
            ...styles.draggableGlass,
            left: dX,
            top: dY,
            borderRadius: 100,
          }}
          onMouseDown={e => {
            e.preventDefault()
            toggleDrag(true)
          }}
          onMouseUp={() => {
            toggleDrag(false)
          }}
          onMouseLeave={() => {
            toggleDrag(false)
          }}
          onMouseMove={e => {
            // clientXY for relative-to-screen
            //  ex. with position: fixed
            // pageXY for relative-to-element
            //  ex. with position: absolute

            // drag && console.log(`x: ${e.pageX}, y: ${e.pageY}`)
            drag && setD({ x: e.pageX - 100, y: e.pageY - 100 })
            // drag && setD({ x: e.clientX - 100, y: e.clientY - 100 })
          }}
        >
          <style jsx>{`
            .draggable-glass {
              touch-action: none;
            }
          `}</style>
        </AnimatedPaper>
      )}

      {/* <NavBar
        location={location}
        // TODO: refactor logic to cap opacity at 1
        opacity={
          typeof window !== "undefined"
            ? currentY / (window.innerHeight / 2) > 1
              ? 1
              : currentY / (window.innerHeight / 2)
            : 0
        }
      /> */}
      <div
        style={{ overflowX: "hidden" }}
        // add listener for when mouse moves too fast and leaves the `.draggable-glass`
        onMouseMove={e => {
          drag && setD({ x: e.pageX - 100, y: e.pageY - 100 })
        }}
      >
        {/* Gradient Background */}
        <animated.span
          style={{
            ...styles.bg1,
            background: _scrollPercent.interpolate({
              range: [0, 0.25, 0.5, 0.75, 1],
              output: [
                `linear-gradient(150deg, ${DARK} 15%, ${DARKER} 35%, ${MID} 55%, ${LIGHTER} 70%, ${LIGHT}`,
                `linear-gradient(150deg, ${LIGHT} 15%, ${DARK} 35%, ${DARKER} 55%, ${MID} 70%, ${LIGHTER}`,
                `linear-gradient(150deg, ${LIGHTER} 15%, ${LIGHT} 35%, ${DARK} 55%, ${DARKER} 70%, ${MID}`,
                `linear-gradient(150deg, ${MID} 15%, ${LIGHTER} 35%, ${LIGHT} 55%, ${DARK} 70%, ${DARKER}`,
                `linear-gradient(150deg, ${DARKER} 15%, ${MID} 35%, ${LIGHTER} 55%, ${LIGHT} 70%, ${DARK}`,
              ],
            }),
          }}
        />
        {/* Dotted Background */}
        <animated.span
          className={"dotted-background"}
          style={{
            ...styles.dottedBackground,
            backgroundSize: _scrollPercent
              .interpolate({
                range: [0, 1],
                output: [5, 25],
              })
              .interpolate(n => `${n}px ${n}px`),
          }}
        >
          {dbgStyleTag}
        </animated.span>

        <div
          style={{
            marginLeft: `auto`,
            marginRight: `auto`,
            maxWidth: rhythm(location.pathname === rootPath ? 48 : 24),
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
          <Footer />
        </div>
      </div>
    </>
  )
}
