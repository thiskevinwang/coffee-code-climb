import React, { useState, useEffect } from "react"
import { useSpring, animated, useTrail, config } from "react-spring"
import styled, { css } from "styled-components"

import { MobileDrawer, Footer, Header, styles } from "./LayoutComponents"
import { rhythm } from "@src/utils/typography"
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

  /**
   * scrollY & setScrollyY
   * @usage scrollY.percent.interpolate({range: [any], output: [any]})
   *
   * @usage setScrollyY({percent: [any] })
   */
  const [scrollY, setScrollY] = useSpring(() => ({
    percent: 0,
    config: config.wobbly,
  }))

  // Attach scroll event listener to window when <Layout /> mounts
  useEffect(() => {
    const handleScroll = () => {
      setScrollY({
        percent:
          window.pageYOffset /
          (document.documentElement.scrollHeight - window.innerHeight),
      })
    }

    const handleKeyPressS = e => {
      e.key === "s" && setSlowMo(state => !state)
    }

    typeof window !== "undefined" &&
      (() => {
        window.addEventListener("scroll", handleScroll)
        window.addEventListener("keypress", handleKeyPressS)
      })()
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("keypress", handleKeyPressS)
    }
  }, [])

  // Slow Motion state hook
  const [slowMo, setSlowMo] = useState(false)

  // SVG animation trail configs
  const zero = { mass: 2, tension: 500, friction: 30 }
  const one = { mass: 3, tension: 400, friction: 32 }
  const two = { mass: 4, tension: 300, friction: 34 }
  const three = { mass: 5, tension: 200, friction: 36 }
  const four = { mass: 6, tension: 100, friction: 38 }
  const configs = [zero, one, two, three, four]

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
    // (property) config?: SpringConfig | ((key: string) => SpringConfig)
    config: i => configs[i],
  }))
  /**
   * An array of SVGs to be rendered by `trail.map((e,i) => {})`
   */
  const SVGS = [SVG.REACT, SVG.APOLLO, SVG.PRISMA, SVG.GRAPHQL, SVG.NODE]
  const StyledSVG = styled.div`
    background: rgba(255, 255, 255, 0.5);
    border: 1px dotted white;
    border-radius: 100%;
    box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
      0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
    display: flex;
    padding: ${props => props.index && props.index * 5 + "px"};
    pointer-events: none;
    position: absolute;
    z-index: 999;
  `
  const AnimatedSVG = animated(StyledSVG)

  // interpolation handler
  // you can add _.random() in here for some weird behavior. (no rerenders!)
  const translate2d = (x, y) =>
    `translate3d(${x}px,${y}px,0) translate3d(-50%,-50%,0)`

  return (
    <div
      onMouseMove={e =>
        setTrail({ xy: [e.pageX, e.pageY], config: slowMo && config.molasses })
      }
    >
      {trail.map((props, index) => (
        <AnimatedSVG
          key={index}
          index={index + 1}
          style={{
            transform: props.xy.interpolate(translate2d),
          }}
        >
          {SVGS[index]}
        </AnimatedSVG>
      ))}

      <div style={{ overflowX: "hidden" }}>
        {/* Gradient Background */}
        <animated.span
          style={{
            ...styles.bg1,
            background: scrollY.percent.interpolate({
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
            backgroundSize: scrollY.percent
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
              transform: scrollY.percent
                .interpolate({
                  range: [0, 1, 2],
                  output: [1, 3, 3],
                })
                .interpolate(x => `scale(${x})`),
              opacity: scrollY.percent
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
