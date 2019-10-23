import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { useSpring, animated, config } from "react-spring"
import { useScroll } from "react-use-gesture"
import { compose } from "redux"

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
import { PageViewCounter } from "components/PageViewCounter"

import "prismjs/plugins/line-numbers/prism-line-numbers.css"

/** http://usejsdoc.org/tags-param.html
 * @param {string} props.title data.site.siteMetadata.title from graphql-pageQuery
 * @param {Location} props.location Parent.props.location
 * @param {React$Node} props.children mapped posts, or markdown
 */

function Layout({ location, title, children }: Props) {
  const rootPath: string = `${__PATH_PREFIX__}/`
  const isDarkMode = useSelector(state => state.isDarkMode)
  const { background } = useSpring({
    background: isDarkMode ? Colors.black : Colors.silver,
  })

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

  const bindScrollGesture = useScroll(
    state => {
      // These two are the same
      // console.log("state", state.values[1])
      // console.log("window", window.document.scrollingElement.scrollTop)

      const { values } = state
      // const scrollTop = state?.event?.target?.documentElement?.scrollTop
      // const scrollHeight = state?.event?.target?.documentElement?.scrollHeight
      // const clientHeight = state?.event?.target?.documentElement?.clientHeight

      const scrollHeight =
        typeof window !== "undefined" &&
        window.document.scrollingElement.scrollHeight
      const clientHeight =
        typeof window !== "undefined" &&
        window.document.scrollingElement.clientHeight

      // console.log(scrollTop / (scrollHeight - clientHeight))
      setScrollY({
        percent: values[1] / (scrollHeight - clientHeight),
      })
    },
    { domTarget: typeof window !== "undefined" && window }
  )
  useEffect(bindScrollGesture, [bindScrollGesture])

  return (
    <>
      <NavBar />

      <PageViewCounter location={location} />

      {/* Background stuffs */}
      <>
        <animated.div
          style={{
            ...styles.mixed,
            background: background,
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
          <main>{children}</main>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default compose(withSVGTrail)(Layout)
