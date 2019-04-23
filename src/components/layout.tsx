import React, { useState, useEffect } from "react"
import { useSpring, animated } from "react-spring"
import { MobileDrawer, Footer, Header, styles } from "./LayoutComponents"
import { Paper } from "@material-ui/core"

import { rhythm } from "@src/utils/typography"
import { isMobile } from "react-device-detect"
import throttle from "lodash/throttle"

/**
 * NOTE: on useSpring() interpolations
 * Make sure arrays passed to `range` & `output` are equal in length
 **/
const GRADIENTS = [
  `linear-gradient(-10deg, #21D4FD 0%, #B721FF 100%)`,
  `linear-gradient-5deg, #08AEEA 0%, #2AF598 100%)`,
  `linear-gradient(0deg, #8EC5FC 0%, #E0C3FC 100%)`,
  `linear-gradient(19deg, #FAACA8 0%, #DDD6F3 100%)`,
  `linear-gradient(20deg, #FEE140 0%, #FA709A 100%)`,
]

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
 * @param {object} props.handleGradientChange TODO...
 */

export default function Layout({
  location,
  title,
  children,
  handleGradientChange,
}: Props) {
  const rootPath: string = `${__PATH_PREFIX__}/`

  // Hook for updating currentY state
  // This gets passed to NavBar's `pageYOffset` props
  const [currentY, setCurrentY] = useState(0)
  // Hook for scrollPercent of the document
  // between 0...1
  const [scrollPercent, setScrollPercent] = useState(0)

  // Attach scroll event listener to window when <Layout /> mounts
  useEffect(() => {
    const handleScroll = throttle(() => {
      setCurrentY(window.pageYOffset)
      setScrollPercent(
        window.pageYOffset /
          (document.documentElement.scrollHeight - window.innerHeight)
      )

      /**
       * Sends an AnimatedInterpolation as the arg passed to the callback
       * assigned to props.handleGradientChange
       **/
      handleGradientChange != undefined &&
        handleGradientChange(
          _scrollPercent.interpolate({
            range: [0, 0.25, 0.5, 0.75, 1],
            output: [...GRADIENTS],
          })
        )
    }, 100)
    typeof window !== "undefined" &&
      window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Spring animation
  // passed to animated.header style prop
  const { x } = useSpring({
    from: { x: 1 },
    x: typeof window !== "undefined" ? currentY / (window.innerHeight / 4) : 0,
  })

  // passed to animated.span (background) style prop
  const { _scrollPercent } = useSpring({
    from: { _scrollPercent: 0 },
    _scrollPercent: scrollPercent,
  })

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
      <AnimatedPaper
        className={`draggable-glass`}
        style={{
          ...styles.draggableGlass,
          left: dX,
          top: dY,
          borderRadius: 100,
          display: isMobile ? "none" : "inherit",
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
              output: [...GRADIENTS],
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
            <Header location={location} title={title} />
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
