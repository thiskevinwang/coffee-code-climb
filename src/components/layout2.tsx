import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { useSpring, animated } from "react-spring"
import { compose } from "redux"
import { Link } from "gatsby"
import { useScroll } from "react-use-gesture"

import { withSVGTrail } from "components"
import { NavBar2 } from "components/Layout2Components/NavBar2"
import { PageViewCounter } from "components/PageViewCounter"

import { rhythm } from "utils/typography"
import * as Colors from "consts/Colors"

import "prismjs/plugins/line-numbers/prism-line-numbers.css"

/** http://usejsdoc.org/tags-param.html
 * @param {string} props.title data.site.siteMetadata.title from graphql-pageQuery
 * @param {Location} props.location Parent.props.location
 * @param {React$Node} props.children mapped posts, or markdown
 */

function Layout({ location, title, children }: Props) {
  const rootPath: string = `${__PATH_PREFIX__}/`
  const topLink =
    location.pathname === rootPath ? <h1>{title}</h1> : <h3>← Go home</h3>

  const isDarkMode = useSelector(state => state.isDarkMode)

  const { background, maxWidth } = useSpring({
    background: isDarkMode ? Colors.blackDarker : Colors.silverLighter,
    maxWidth: rhythm(location.pathname === rootPath ? 36 : 24),
  })

  const [{ scrollPercent }, setScrollProps] = useSpring(() => ({
    scrollPercent: 0,
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
      setScrollProps({
        scrollPercent: values[1] / (scrollHeight - clientHeight),
      })
    },
    { domTarget: typeof window !== "undefined" && window }
  )
  useEffect(bindScrollGesture, [bindScrollGesture])

  return (
    <animated.div
      style={{
        background: scrollPercent.interpolate({
          range: [0, 1],
          output: isDarkMode
            ? [Colors.blackLighter, Colors.blackDarker]
            : [Colors.silverLighter, Colors.silverDarker],
        }),
      }}
    >
      <NavBar2 />

      <PageViewCounter location={location} />

      <animated.div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth,
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        <Link
          to={`/`}
          style={{
            display: "flex",
            flexFlow: "row wrap",
            boxShadow: `none`,
            textDecoration: `none`,
            color: `inherit`,
          }}
        >
          {topLink}
        </Link>
        <main>{children}</main>
      </animated.div>
    </animated.div>
  )
}

export default compose(withSVGTrail)(Layout)
