import React, { memo } from "react"
import { useSelector } from "react-redux"
import { useSpring, animated } from "react-spring"
import { Link, PageProps } from "gatsby"
import styled from "styled-components"

import { NavBar2 } from "components/Layout2Components/NavBar2"
import { Blob } from "components/Blob"

import { useWindowScrollPercent } from "hooks/useWindowScrollPercent"

import { rhythm } from "utils/typography"
import { Colors } from "consts/Colors"
import Footer from "./Footer"

const ThemedBackground = styled(animated.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -9000;
`

interface Props {
  location: PageProps["location"]
  title: string
}
const Layout2: React.FC<Props> = ({ location, title, children }) => {
  const rootPath: string = `${__PATH_PREFIX__}/`
  const isAppPage = location.pathname.startsWith("/app")
  const isAuthPage = location.pathname.startsWith("/auth")
  const isHomePage = location.pathname === rootPath
  const header =
    isAppPage || isAuthPage ? null : isHomePage ? (
      <h1>{title}</h1>
    ) : (
      <h3>← 🏠</h3>
    )

  const isDarkMode = useSelector((state: any) => state.isDarkMode)

  const { background } = useSpring({
    background: isDarkMode ? Colors.BLACK_DARKER : Colors.SILVER_LIGHT,
  })

  const [scrollYPercent] = useWindowScrollPercent()

  return (
    <>
      <ThemedBackground style={{ background }} />
      <NavBar2 />

      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth:
            location.pathname === rootPath
              ? rhythm(36)
              : isAppPage
              ? "var(--geist-page-width-with-margin)"
              : rhythm(24),
          padding: `${rhythm(1.5)} var(--geist-gap)`,
        }}
      >
        {header && (
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
            {header}
          </Link>
        )}
        <main>{children}</main>
        <Footer />
      </div>
      <Blob.Holder>
        <Blob y={scrollYPercent} />
      </Blob.Holder>
    </>
  )
}

export default memo(Layout2)
