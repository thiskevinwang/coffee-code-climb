import React, { memo } from "react"
import { useSelector } from "react-redux"
import { useSpring, animated, OpaqueInterpolation } from "react-spring"
import { compose } from "redux"
import { Link } from "gatsby"
import styled from "styled-components"

import { NavBar2 } from "components/Layout2Components/NavBar2"

import { useWindowScrollPercent } from "hooks/useWindowScrollPercent"

import { rhythm } from "utils/typography"
import { Colors } from "consts/Colors"
import Footer from "./Footer"

import "prismjs/plugins/line-numbers/prism-line-numbers.css"

const ThemedBackground = styled(animated.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -9000;
`

function Layout({ location, title, children }) {
  const rootPath: string = `${__PATH_PREFIX__}/`
  const topLink =
    location.pathname === rootPath ? <h1>{title}</h1> : <h3>← Go home</h3>

  const isDarkMode = useSelector((state: any) => state.isDarkMode)

  const { background } = useSpring({
    background: isDarkMode ? Colors.BLACK_DARKER : Colors.SILVER_LIGHTER,
  })

  const [scrollYPercent] = useWindowScrollPercent()

  return (
    <>
      <BlobHolder>
        <Blob y={scrollYPercent} />
      </BlobHolder>
      <ThemedBackground style={{ background }} />
      <NavBar2 />

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

export default compose(memo)(Layout)

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
  "M422.5,298.5Q419,347,368.5,357.5Q318,368,284,372Q250,376,202,396.5Q154,417,125,378Q96,339,67,294.5Q38,250,89.5,218.5Q141,187,148,136.5Q155,86,202.5,56Q250,26,281,84Q312,142,342.5,160.5Q373,179,399.5,214.5Q426,250,422.5,298.5Z"

const Blob = ({ y }: BlobProps) => {
  return (
    <animated.svg viewBox="0 0 500 500" width="100%">
      <animated.path
        d={y.interpolate({ range: [0, 0.5, 1], output: [D1, D2, D3] })}
        fill={y.interpolate({
          range: [0, 0.33, 0.66, 1],
          output: [Colors.VIOLET, Colors.ALERT, Colors.PURPLE, Colors.CYAN],
        })}
      ></animated.path>
    </animated.svg>
  )
}
