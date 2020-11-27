import React, { memo } from "react"
import { useSelector } from "react-redux"
import { useSpring, animated, OpaqueInterpolation } from "react-spring"
import { Link, PageProps } from "gatsby"
import styled from "styled-components"

import { NavBar2 } from "components/Layout2Components/NavBar2"

import { useWindowScrollPercent } from "hooks/useWindowScrollPercent"

import { rhythm } from "utils/typography"
import { Colors } from "consts/Colors"
import Footer from "./Footer"

const ThemedBackground = styled(animated.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -9000;
`

interface Props {
  location: PageProps["location"]
  title: string
}
const Layout2: React.FC<Props> = ({ location, title, children }) => {
  const rootPath: string = `${__PATH_PREFIX__}/`
  const isAppPage = location.pathname.startsWith("/app")
  const isHomePage = location.pathname === rootPath
  const header = isAppPage ? null : isHomePage ? (
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
      <BlobHolder>
        <Blob y={scrollYPercent} />
      </BlobHolder>
    </>
  )
}

export default memo(Layout2)

const BlobHolder = styled.div`
  display: flex;
  align-items: flex-end;
  position: fixed;
  top: 10%;
  left: -50%;
  height: 100vh;
  width: 150vw;
  min-width: 800px;
  z-index: -8000;
  opacity: 0.25;
  pointer-events: none;
`

interface BlobProps {
  y: OpaqueInterpolation<number>
}

// complexity 12
// https://blobs.app/
const D1 =
  "M438,300.5Q424,351,376.5,369.5Q329,388,289.5,427.5Q250,467,194.5,455Q139,443,105.5,398Q72,353,83.5,301.5Q95,250,81,197Q67,144,125.5,140Q184,136,217,85Q250,34,310.5,37Q371,40,402,92Q433,144,442.5,197Q452,250,438,300.5Z"
const D2 =
  "M451,308Q450,366,380,359.5Q310,353,280,365Q250,377,203,394.5Q156,412,134,371Q112,330,122.5,290Q133,250,112,204Q91,158,119.5,116Q148,74,199,103.5Q250,133,307,93Q364,53,361.5,120Q359,187,405.5,218.5Q452,250,451,308Z"
const D3 =
  "M385,276.5Q341,303,348,367.5Q355,432,302.5,391Q250,350,205.5,377Q161,404,123,374.5Q85,345,102.5,297.5Q120,250,135,221Q150,192,138,114Q126,36,188,38.5Q250,41,308.5,44Q367,47,373.5,111Q380,175,404.5,212.5Q429,250,385,276.5Z"

const Blob = memo(({ y }: BlobProps) => {
  return (
    <animated.svg viewBox="0 0 500 500" width="100%">
      {/* POC for react-spring animated SVG gradient background */}
      {/* <animated.defs>
        <animated.linearGradient
          id="blobGradient"
          gradientTransform="rotate(90)"
        >
          <animated.stop
            offset="0%"
            stopColor={y.interpolate({
              range: [0, 0.25, 0.5, 0.75, 1],
              output: ["#ffecde", "#ffccdd", "#ff9a9e", "#ef8a8a", "#a18cd1"],
            })}
          />
          <animated.stop
            offset="100%"
            stopColor={y.interpolate({
              range: [0, 0.25, 0.5, 0.75, 1],
              output: ["#ffd1ff", "#fcb69f", "#fcb3ef", "#fda085", "#fbc2eb"],
            })}
          />
        </animated.linearGradient>
      </animated.defs> */}

      <animated.path
        d={y.interpolate({ range: [0, 0.5, 1], output: [D1, D2, D3] })}
        fill={y.interpolate({
          range: [0, 0.33, 0.66, 1],
          output: [Colors.VIOLET, Colors.ALERT, Colors.PURPLE, Colors.CYAN],
        })}
        // fill="url('#blobGradient')"
      ></animated.path>
    </animated.svg>
  )
})
