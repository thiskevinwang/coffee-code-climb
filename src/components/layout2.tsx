import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { useSpring, animated, config } from "react-spring"
import { compose } from "redux"

import {
  ButtonAndDrawer,
  Footer,
  Header,
  styles,
  withSVGTrail,
  NavBar,
} from "components"

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
  const isDarkMode = useSelector(state => state.isDarkMode)

  const { background } = useSpring({
    background: isDarkMode ? Colors.black : Colors.silver,
  })
  return (
    <animated.div
      style={{
        overflowX: "hidden",
        background,
      }}
    >
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(location.pathname === rootPath ? 48 : 24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        <main>{children}</main>
      </div>
    </animated.div>
  )
}

export default compose(withSVGTrail)(Layout)
