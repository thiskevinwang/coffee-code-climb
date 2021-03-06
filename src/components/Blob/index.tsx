import React, { ComponentType } from "react"
import { Colors } from "consts/Colors"
import { animated } from "react-spring"
import type { OpaqueInterpolation } from "react-spring"
import styled from "styled-components"

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

const Blob: ComponentType<BlobProps> & { Holder: typeof Holder } = ({ y }) => {
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
        d={y?.interpolate?.({ range: [0, 0.5, 1], output: [D1, D2, D3] }) ?? D1}
        fill={y?.interpolate({
          range: [0, 0.33, 0.66, 1],
          output: [Colors.VIOLET, Colors.ALERT, Colors.PURPLE, Colors.CYAN],
        })}
        // fill="url('#blobGradient')"
      ></animated.path>
    </animated.svg>
  )
}

const Holder = styled.div`
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

Blob.Holder = Holder

export { Blob }
