import React, { useState, useEffect, useCallback } from "react"
import { animated, useTrail, config } from "react-spring"
import styled from "styled-components"

import * as SVG from "@src/svg"

const SVGS = [SVG.REACT, SVG.APOLLO, SVG.PRISMA, SVG.GRAPHQL, SVG.NODE]
// SVG animation trail configs
const zero = { mass: 2, tension: 500, friction: 30 }
const one = { mass: 3, tension: 400, friction: 32 }
const two = { mass: 4, tension: 300, friction: 34 }
const three = { mass: 5, tension: 200, friction: 36 }
const four = { mass: 6, tension: 100, friction: 38 }

const configs = [zero, one, two, three, four]

const StyledSVG = styled.div`
  background: rgba(255, 255, 255, 0.5);
  border: 1px dotted white;
  border-radius: 100%;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  display: flex;
  padding: ${props => props.index && props.index * 5 + "px"};
  pointer-events: none;
  position: absolute;
  z-index: 999;
`
const AnimatedSVG = animated(StyledSVG)

// interpolation handler
// you can add _.random() in here for some weird behavior. (no rerenders!)
const translate2d = (x, y) =>
  `translate3d(${x}px,${y}px,0) translate3d(-50%,-50%,0)`

const Wrapper = ({ children }) => {
  const [slowMo, setSlowMo] = useState(false)

  // https://www.react-spring.io/docs/hooks/use-trail
  const [trail, setTrail, stop] = useTrail(SVGS.length, () => ({
    xy: [0, 0],
    config: i => {
      return configs[i]
    },
  }))

  const memoizedSetTrail = useCallback(setTrail, [])

  useEffect(() => {
    const handleKeyPressS = e => {
      e.key === "s" && setSlowMo(state => !state)
    }

    typeof window !== "undefined" &&
      window.addEventListener("keypress", handleKeyPressS)

    return () => {
      window.removeEventListener("keypress", handleKeyPressS)
    }
  }, [])

  return (
    <div
      className="withSVGTrail--HOC"
      onMouseMove={e =>
        memoizedSetTrail({
          xy: [e.pageX, e.pageY],
          config: slowMo && config.molasses,
        })
      }
    >
      {trail.map((props, index) => (
        <AnimatedSVG
          key={index}
          index={index + 1}
          style={{
            transform: props.xy.interpolate(translate2d),
          }}
        >
          {SVGS[index]}
        </AnimatedSVG>
      ))}
      {children}
    </div>
  )
}

export default function withSVGTrail(BaseComponent) {
  return props => (
    <Wrapper>
      <BaseComponent {...props} />
    </Wrapper>
  )
}
