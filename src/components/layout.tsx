import React, { useState, useEffect } from "react"
import { useSpring, animated, useTrail } from "react-spring"
import { MobileDrawer, Footer, Header, styles } from "./LayoutComponents"
import { Paper } from "@material-ui/core"

import { rhythm } from "@src/utils/typography"
import { isMobile } from "react-device-detect"
import throttle from "lodash/throttle"

import * as SVG from "@src/svg"

require("prismjs/plugins/line-numbers/prism-line-numbers.css")

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
  <style>{`
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

  // const [d, setD] = useState({ x: -75, y: -75 })
  // const [drag, toggleDrag] = useState(false)

  // const { dX, dY } = useSpring({
  //   from: { dX: -100, dY: -100 },
  //   dX: typeof window !== "undefined" ? d.x : -75,
  //   dY: typeof window !== "undefined" ? d.y : -75,
  //   config: { mass: 1, tension: 250, friction: 10 },
  // })

  // Wrap <Paper> in `animated` to work with `useSpring`
  // const AnimatedPaper = animated(Paper)

  // SVG animation trail
  const zero = { mass: 2, tension: 500, friction: 30 }
  const one = { mass: 3, tension: 400, friction: 32 }
  const two = { mass: 4, tension: 300, friction: 34 }
  const three = { mass: 5, tension: 200, friction: 36 }
  const four = { mass: 6, tension: 100, friction: 38 }
  const configs = [zero, one, two, three, four]

  const translate2d = (x, y) =>
    `translate3d(${x}px,${y}px,0) translate3d(-50%,-50%,0)`

  /**
   * useTrail() 👉 https://www.react-spring.io/docs/hooks/use-trail
   * @param {number} count The number of animated "things"
   * @param {func} getProps
   *
   * @return {array} [trail, set, stop?]
   *
   * @usage trail.map(props => <animated.div style={props} />)
   */
  const [trail, setTrail] = useTrail(5, () => ({
    xy: [0, 0],
    config: i => configs[i],
  }))
  /**
   * An array of SVGs to be rendered by `trail`
   */
  const SVGS = [SVG.REACT, SVG.APOLLO, SVG.PRISMA, SVG.GRAPHQL, SVG.NODE]

  return (
    <div onMouseMove={e => setTrail({ xy: [e.pageX, e.pageY] })}>
      {trail.map((props, index) => (
        <animated.div
          key={index}
          style={{
            display: `flex`,
            position: "absolute",
            border: "1px dotted white",
            borderRadius: `100%`,
            padding: 10,
            background: `rgba(255,255,255,0.5)`,
            transform: props.xy.interpolate(translate2d),
          }}
        >
          {SVGS[index]}
        </animated.div>
      ))}

      {/* <AnimatedPaper
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
        <style>{`
          .draggable-glass {
            touch-action: none;
          }
        `}</style>
      </AnimatedPaper> */}

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
        // onMouseMove={e => {
        //   drag && setD({ x: e.pageX - 100, y: e.pageY - 100 })
        // }}
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
            maxWidth: rhythm(location.pathname === rootPath ? 48 : 48),
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
            buttonStyle={{
              zIndex: 99,
              position: "fixed",
              right: 0,
              bottom: 0,
              marginRight: 30,
              marginBottom: 60,
            }}
          />
          <main>
            {children}

            {/**
             * The following style tag updates any prismjs code block styling generated by markdown.
             * It fixes issues with aligning line-numbers.
             */}
            <style>{`
              .gatsby-highlight {
                background-color: #f5f2f0;
                border-radius: 0.3em;
                margin: 0.5em 0;
                padding: 1em;
                overflow: auto;
              }

              .gatsby-highlight pre[class*="language-"].line-numbers {
                font-family: "Operator Mono", "Dank Mono", Consolas, Monaco,
                  "Andale Mono", "Ubuntu Mono", monospace;
                padding: 0;
                padding-left: 2.8em;
                overflow: initial;
              }

              .gatsby-highlight pre[class*="language-"] > code {
                font-family: "Operator Mono", "Dank Mono", Consolas, Monaco,
                  "Andale Mono", "Ubuntu Mono", monospace;
              }
              .gatsby-highlight pre[class*="language-"] > code .comment {
                font-style: italic;
              }
            `}</style>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  )
}
