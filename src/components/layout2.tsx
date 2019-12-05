import * as React from "react"
import { useSelector } from "react-redux"
import { useSpring, animated } from "react-spring"
import { compose } from "redux"
import { Link } from "gatsby"
import styled from "styled-components"

import { withSVGTrail, Footer } from "components"
import { NavBar2 } from "components/Layout2Components/NavBar2"
import { PageViewCounter } from "components/PageViewCounter"

import { useWindowScrollPercent } from "hooks/useWindowScrollPercent"

import { rhythm } from "utils/typography"
import * as Colors from "consts/Colors"

import "prismjs/plugins/line-numbers/prism-line-numbers.css"

const ThemedBackground = styled(animated.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -9000;
`

const Dots = styled(animated.div)`
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 30%;
  transform: skewX(6deg);
  transform-origin: top right;
  z-index: -8998;

  background-image: -webkit-repeating-radial-gradient(
    center center,
    ${props =>
      !props.isDarkMode ? `rgba(255, 255, 255, 0.8)` : `rgba(0, 0, 0, 0.5)`},
    ${props =>
        !props.isDarkMode ? `rgba(255, 255, 255, 0.8)` : `rgba(0, 0, 0, 0.5)`}
      1px,
    transparent 1px,
    transparent 100%
  );
  -webkit-background-size: 15px 15px;
  -moz-background-size: 15px 15px;
  background-size: 15px 15px;
`

function Layout({ location, title, children }) {
  const rootPath: string = `${__PATH_PREFIX__}/`
  const topLink =
    location.pathname === rootPath ? <h1>{title}</h1> : <h3>← Go home</h3>

  const isDarkMode = useSelector((state: any) => state.isDarkMode)

  const { background } = useSpring({
    background: isDarkMode ? Colors.blackDarker : Colors.silverLighter,
  })

  const [scrollYPercent] = useWindowScrollPercent()

  return (
    <>
      <Dots />
      <ThemedBackground
        style={{
          background,
          // background: scrollYPercent.interpolate({
          //   range: [0, 1],
          //   output: isDarkMode
          //     ? [Colors.blackLighter, Colors.blackDarker]
          //     : [Colors.silverLighter, Colors.silverDarker],
          // }),
        }}
      />
      <NavBar2 />

      <PageViewCounter location={location} />

      <animated.div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(location.pathname === rootPath ? 36 : 24),
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
        <Footer />
      </animated.div>
    </>
  )
}

export default compose(withSVGTrail)(Layout)
