import React, { memo } from "react"
import { useSelector } from "react-redux"
import { useSpring, animated } from "react-spring"
import { compose } from "redux"
import styled from "styled-components"
import type { PageProps } from "gatsby"

import { Footer, Header, NavBar } from "components"
import { StickyNumbers } from "components/StickyNumbers"
import { Colors, LIGHT_GRADIENTS, DARK_GRADIENTS } from "consts/Colors"
import { AnimatedDottedBackground } from "components/AnimatedDottedBackground"

import { rhythm } from "utils/typography"
import { useWindowScrollPercent } from "hooks/useWindowScrollPercent"
import type { RootState } from "_reduxState"

const ThemedBackground = styled(animated.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -9000;
`

const GradientBackground = styled(animated.div)`
  position: fixed;
  top: -20%; /* overwritten by react-spring */
  left: 0;
  height: 100%;
  width: 100%;
  opacity: 0.7;
  z-index: -8999;
`

const LayoutFrame = styled(animated.div)`
  /* border: ${process.env.NODE_ENV === "development" && `1px dotted red`}; */
`
const Main = styled(animated.main)`
  /* border: ${process.env.NODE_ENV === "development" &&
  `1px dotted orange`}; */
`
const Inner = styled(animated.div)`
  /* border: ${process.env.NODE_ENV === "development" &&
  `1px dotted yellow`}; */
`

interface LayoutProps {
  title?: string
  location?: PageProps["location"]
}
const Layout: React.FC<LayoutProps> = ({ location, title, children }) => {
  const rootPath: string = `${__PATH_PREFIX__}/`
  const isAppPage = location.pathname.startsWith("/app")
  const isAuthPage = location.pathname.startsWith("/auth")
  const isHomePage = location.pathname === rootPath

  const isDarkMode = useSelector((state: RootState) => state.isDarkMode)
  const themedBackgroundProps = useSpring({
    background: isDarkMode ? Colors.BLACK : Colors.SILVER,
  })

  const [scrollYPercent] = useWindowScrollPercent()

  return (
    <>
      <NavBar />

      {/* Background stuffs */}
      <>
        <ThemedBackground style={themedBackgroundProps} />
        <GradientBackground
          style={{
            background: scrollYPercent.interpolate({
              range: [0, 0.25, 0.5, 0.75, 1],
              output: isDarkMode ? DARK_GRADIENTS : LIGHT_GRADIENTS,
            }),
            transform: scrollYPercent.interpolate({
              range: [0, 1],
              output: [`skewY(-25deg)`, `skewY(25deg)`],
            }),
            transformOrigin: scrollYPercent.interpolate({
              range: [0, 1],
              output: [`0% 0%`, `100% 0%`],
            }),
            top: scrollYPercent.interpolate({
              range: [0, 0.5, 1],
              output: [`-20%`, `-45%`, `-20%`],
            }),
          }}
        />
        <AnimatedDottedBackground
          style={{
            backgroundSize: scrollYPercent
              .interpolate({
                range: [0, 1],
                output: [25, 50],
              })
              .interpolate((n) => `${n}px ${n}px`),
          }}
        />
      </>

      <StickyNumbers />

      <LayoutFrame>
        <Inner
          style={{
            marginLeft: `auto`,
            marginRight: `auto`,
            maxWidth:
              location.pathname === rootPath
                ? rhythm(48)
                : isAppPage
                ? "100vw"
                : rhythm(24),
            padding: isAppPage ? 0 : `${rhythm(1.5)} var(--geist-gap)`,
          }}
        >
          <animated.header
            style={{
              transform: scrollYPercent
                .interpolate({
                  range: [0, 1, 2],
                  output: [1, 100, 3],
                })
                .interpolate((x) => `translateY(${2 * x}vh)`),
              opacity: scrollYPercent
                .interpolate({
                  range: [0, 0.25, 1, 2],
                  output: [1, 0, 0, 0],
                })
                .interpolate((x) => x),
            }}
          >
            <Header location={location} title={title} />
          </animated.header>

          <Main>{children}</Main>
          {!isAppPage && <Footer />}
        </Inner>
      </LayoutFrame>
    </>
  )
}

export default compose(memo)(Layout)
