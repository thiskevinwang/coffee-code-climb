import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { useSpring, animated, config } from "react-spring"
import { compose } from "redux"
import { useQuery } from "@apollo/react-hooks"

import {
  ButtonAndDrawer,
  Footer,
  Header,
  styles,
  withSVGTrail,
  NavBar,
} from "components"
import { StickyNumbers } from "components/StickyNumbers"
import { rhythm } from "utils/typography"
import * as Colors from "consts/Colors"
import { AnimatedDottedBackground } from "components/AnimatedDottedBackground"

import { GET_PAGE } from "apollo"

import "prismjs/plugins/line-numbers/prism-line-numbers.css"

/** http://usejsdoc.org/tags-param.html
 * @param {string} props.title data.site.siteMetadata.title from graphql-pageQuery
 * @param {Location} props.location Parent.props.location
 * @param {React$Node} props.children mapped posts, or markdown
 */

function Layout({ location, title, children }: Props) {
  const { data, loading, error } = useQuery(GET_PAGE, {
    variables: { id: 1, location: location.href },
  })
  // console.log("DA", data.getPage.attributes.views)
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
      <small style={{ position: "sticky", top: 70, paddingLeft: 5 }}>
        {loading
          ? "..."
          : error
          ? "😵"
          : data
          ? `${data.getPage.attributes.views} ${
              data.getPage.attributes.views === 1 ? "view" : "views"
            }`
          : "..."}
      </small>
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
                ? Colors.DARK_GRADIENTS
                : Colors.LIGHT_GRADIENTS,
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

      {/* Numbers */}
      <StickyNumbers />
      <div style={{ overflowX: "hidden" }}>
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
              transform: scrollY.percent
                .interpolate({
                  range: [0, 1, 2],
                  output: [1, 100, 3],
                })
                .interpolate(x => `translateY(${2 * x}vh)`),
              opacity: scrollY.percent
                .interpolate({
                  range: [0, 0.25, 1, 2],
                  output: [1, 0, 0, 0],
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
                background-color: ${
                  isDarkMode ? Colors.blackLighter : Colors.greyDark
                };
                border-radius: 0.3em;
                margin: 0.5em 0;
                padding: 1em;
                overflow: auto;
              }

              .gatsby-highlight pre[class*="language-"].line-numbers {
                background-color: ${
                  isDarkMode ? Colors.blackLighter : Colors.greyDark
                };
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
