import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { useSpring, animated, useTrail, config } from "react-spring"
import styled, { css } from "styled-components"
import { compose } from "redux"

import {
  ButtonAndDrawer,
  Footer,
  Header,
  styles,
  withSVGTrail,
  NavBar,
} from "./LayoutComponents"
import { rhythm } from "src/utils/typography"
import * as Colors from "consts/Colors"

import "prismjs/plugins/line-numbers/prism-line-numbers.css"

/**
 * NOTE: on useSpring() interpolations
 * Make sure arrays passed to `range` & `output` are equal in length
 **/
const LIGHT_GRADIENTS = [
  `linear-gradient(0deg, #ffecde 0%, #ffd1ff 100%)`,
  `linear-gradient(90deg, #ffccdd 0%, #fcb69f 100%)`,
  `linear-gradient(0deg, #ff9a9e 0%, #fcb3ef 100%)`,
  `linear-gradient(120deg, #ef8a8a 0%, #fda085 100%)`,
  `linear-gradient(180deg, #a18cd1 0%, #fbc2eb 100%)`,
]
const DARK_GRADIENTS = [
  `linear-gradient(-10deg, #21D4FD 0%, #B721FF 100%)`,
  `linear-gradient(-5deg, #08AEEA 0%, #2AF598 100%)`,
  `linear-gradient(0deg, #8EC5FC 0%, #E0C3FC 100%)`,
  `linear-gradient(0deg, #9890e3 0%, #b1f4cf 100%)`,
  `linear-gradient(0deg, #5ee7df 0%, #b490ca 100%)`,
]

const DottedBackground = styled.div`
  background-image: -webkit-repeating-radial-gradient(
    center center,
    ${props =>
      props.isDarkMode ? `rgba(255, 255, 255, 0.8)` : `rgba(0, 0, 0, 0.5)`},
    ${props =>
        props.isDarkMode ? `rgba(255, 255, 255, 0.8)` : `rgba(0, 0, 0, 0.5)`}
      1px,
    transparent 1px,
    transparent 100%
  );
  background-image: -moz-repeating-radial-gradient(
    center center,
    rgba(0, 0, 0, 0.5),
    rgba(0, 0, 0, 0.5) 1px,
    transparent 1px,
    transparent 100%
  );
  background-image: -ms-repeating-radial-gradient(
    center center,
    rgba(0, 0, 0, 0.5),
    rgba(0, 0, 0, 0.5) 1px,
    transparent 1px,
    transparent 100%
  );
  background-image: repeating-radial-gradient(
    center center,
    rgba(0, 0, 0, 0.5),
    rgba(0, 0, 0, 0.5) 1px,
    transparent 1px,
    transparent 100%
  );
  -webkit-background-size: 15px 15px;
  -moz-background-size: 15px 15px;
  background-size: 15px 15px;
`
const AnimatedDottedBackground = animated(DottedBackground)

/** http://usejsdoc.org/tags-param.html
 * @param {string} props.title data.site.siteMetadata.title from graphql-pageQuery
 * @param {Location} props.location Parent.props.location
 * @param {React$Node} props.children mapped posts, or markdown
 */

function Layout({ location, title, children }: Props) {
  const rootPath: string = `${__PATH_PREFIX__}/`
  const isDarkMode = useSelector(state => state.isDarkMode)

  /**
   * scrollY & setScrollyY
   * @usage scrollY.percent.interpolate({range: [any], output: [any]})
   *
   * @usage setScrollyY({percent: [any] })
   */
  const [scrollY, setScrollY] = useSpring(() => ({
    percent: 0,
    config: { ...config.molasses, clamp: true },
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

    typeof window !== "undefined" &&
      window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <>
      <NavBar />
      {/* Background stuffs */}
      <>
        <div
          style={{
            ...styles[isDarkMode ? "bgDark" : "bgLight"],
            ...styles.mixed,
          }}
        />
        {/* Gradient Background */}
        <animated.div
          style={{
            ...styles.bg1,
            background: scrollY.percent.interpolate({
              range: [0, 0.25, 0.5, 0.75, 1],
              output: isDarkMode
                ? Array.from(DARK_GRADIENTS)
                : Array.from(LIGHT_GRADIENTS),
            }),
            transform: scrollY.percent.interpolate({
              range: [0, 1],
              output: [`skewY(-6deg)`, `skewY(6deg)`],
            }),
            transformOrigin: scrollY.percent.interpolate({
              range: [0, 1],
              output: [`0% 0%`, `100% 0%`],
            }),
            height: scrollY.percent.interpolate({
              range: [0, 0.5, 1],
              output: [`50%`, `45%`, `50%`],
            }),
          }}
        />
        {/* Dotted Background */}
        <AnimatedDottedBackground
          isDarkMode={isDarkMode}
          style={{
            ...styles.dottedBackground,
            backgroundSize: scrollY.percent
              .interpolate({
                range: [0, 1],
                output: [25, 50],
              })
              .interpolate(n => `${n}px ${n}px`),
          }}
        />
      </>
      <div style={{ overflowX: "hidden" }}>
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

          <ButtonAndDrawer />
          <main>
            {children}

            {/**
             * The following style tag updates any prismjs code block styling generated by markdown.
             * It fixes issues with aligning line-numbers.
             */}
            <style>{`
              .gatsby-highlight {
                background-color: ${Colors.blackLighter};
                border-radius: 0.3em;
                margin: 0.5em 0;
                padding: 1em;
                overflow: auto;
              }

              .gatsby-highlight pre[class*="language-"].line-numbers {
                background-color: ${Colors.blackLighter};
                font-family: "Dank Mono", "Fira Code", "Operator Mono", Consolas, Monaco,
                "Andale Mono", "Ubuntu Mono", monospace;
                padding: 0;
                padding-left: 2.8em;
                overflow: initial;
              }

              .gatsby-highlight pre[class*="language-"] > code {
                font-family: "Dank Mono", "Fira Code", "Operator Mono", Consolas, Monaco,
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
    </>
  )
}

export default compose(withSVGTrail)(Layout)
