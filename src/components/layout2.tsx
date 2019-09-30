import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { useSpring, animated, config } from "react-spring"
import { compose } from "redux"
import { Link } from "gatsby"

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
  const topLinkText = location.pathname === rootPath ? title : "Go home"

  const isDarkMode = useSelector(state => state.isDarkMode)

  const { background, maxWidth } = useSpring({
    background: isDarkMode ? Colors.blackDarker : Colors.silverLighter,
    maxWidth: isDarkMode
      ? rhythm(location.pathname === rootPath ? 36 : 24)
      : rhythm(location.pathname === rootPath ? 48 : 24),
  })
  return (
    <animated.div
      style={{
        background,
      }}
    >
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
          <h1>{topLinkText}</h1>
        </Link>
        <main>{children}</main>
      </animated.div>
    </animated.div>
  )
}

export default compose(withSVGTrail)(Layout)
