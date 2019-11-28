import * as React from "react"
import { useSelector } from "react-redux"
import { useSpring, animated } from "react-spring"
import { compose } from "redux"
import styled from "styled-components"

import {
  ButtonAndDrawer,
  Footer,
  Header,
  withSVGTrail,
  NavBar,
} from "components"
import { StickyNumbers } from "components/StickyNumbers"
import { rhythm } from "utils/typography"
import * as Colors from "consts/Colors"
import { AnimatedDottedBackground } from "components/AnimatedDottedBackground"
import { PageViewCounter } from "components/PageViewCounter"

import { useWindowScrollPercent } from "hooks/useWindowScrollPercent"

import "prismjs/plugins/line-numbers/prism-line-numbers.css"

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

const LayoutFrame = styled.div`
  border: ${process.env.NODE_ENV === "development" && `1px dotted red`};
`
const Main = styled.main`
  border: ${process.env.NODE_ENV === "development" && `1px dotted orange`};
`
const Inner = styled.div`
  border: ${process.env.NODE_ENV === "development" && `1px dotted yellow`};
`

function Layout({ location, title, children }: Props) {
  const rootPath: string = `${__PATH_PREFIX__}/`
  const isDarkMode = useSelector(state => state.isDarkMode)
  const themedBackgroundProps = useSpring({
    background: isDarkMode ? Colors.black : Colors.silver,
  })

  const [scrollYPercent] = useWindowScrollPercent()

  return (
    <>
      <NavBar />

      <PageViewCounter location={location} />

      {/* Background stuffs */}
      <>
        <ThemedBackground style={themedBackgroundProps} />
        <GradientBackground
          style={{
            background: scrollYPercent.interpolate({
              range: [0, 0.25, 0.5, 0.75, 1],
              output: isDarkMode
                ? Colors.DARK_GRADIENTS
                : Colors.LIGHT_GRADIENTS,
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
          isDarkMode={isDarkMode}
          style={{
            backgroundSize: scrollYPercent
              .interpolate({
                range: [0, 1],
                output: [25, 50],
              })
              .interpolate(n => `${n}px ${n}px`),
          }}
        />
      </>

      {/* <StickyNumbers /> */}

      <LayoutFrame>
        <Inner
          style={{
            marginLeft: `auto`,
            marginRight: `auto`,
            maxWidth: rhythm(location.pathname === rootPath ? 48 : 24),
            padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
          }}
        >
          <animated.header
            style={{
              transform: scrollYPercent
                .interpolate({
                  range: [0, 1, 2],
                  output: [1, 100, 3],
                })
                .interpolate(x => `translateY(${2 * x}vh)`),
              opacity: scrollYPercent
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
          <Main
            style={{
              height: document.documentElement.scrollHeight,
            }}
          >
            {children}
          </Main>
          <Footer />
        </Inner>
      </LayoutFrame>
    </>
  )
}

export default compose(withSVGTrail)(Layout)
