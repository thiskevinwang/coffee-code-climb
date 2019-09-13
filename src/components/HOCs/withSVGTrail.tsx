import React, { useState, useEffect, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { animated, useTrail, config, interpolate } from "react-spring"
import { useMove } from "react-use-gesture"
import { ReactEventHandlers } from "react-use-gesture/dist/types"

import styled from "styled-components"
import _ from "lodash"

import { svgZ } from "consts"
import { setIsDarkMode, setShowTrail, setSlowMo, setVibrate } from "src/state"
import * as SVG from "src/svg"

const SVGS = [SVG.REACT, SVG.APOLLO, SVG.PRISMA, SVG.GRAPHQL, SVG.NODE]
// SVG animation trail configs
const configs = [
  { mass: 2, tension: 500, friction: 30 },
  { mass: 3, tension: 400, friction: 32 },
  { mass: 4, tension: 300, friction: 34 },
  { mass: 5, tension: 200, friction: 36 },
  { mass: 6, tension: 100, friction: 38 },
]

const AnimatedSVG = styled(animated.div)`
  border-radius: 100%;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  display: flex;
  pointer-events: none;
  position: absolute;
  z-index: 999;
  transition: background 500ms ease, border 500ms ease;
`

// interpolation handler
// you can add _.random() in here for some weird behavior. (no rerenders!)
const translate2d = (x, y) =>
  `translate3d(${x}px,${y}px,0) translate3d(-50%,-50%,0)`

const translate2dVibrate = (x, y, size = 1) =>
  `translate3d(${_.random(x - 5, x + 5)}px,${_.random(
    y - 5,
    y + 5
  )}px,0) translate3d(-50%,-50%,0)`

const Wrapper = ({ children }) => {
  // Redux hooks
  const isDarkMode = useSelector(state => state.isDarkMode)
  const showTrail = useSelector(state => state.showTrail)
  const slowMo = useSelector(state => state.slowMo)
  const vibrate = useSelector(state => state.vibrate)

  const dispatch = useDispatch()

  const dispatchSetIsDarkMode = useCallback(
    (state: boolean): void => dispatch(setIsDarkMode(state)),
    []
  )
  const dispatchSetShowTrail = useCallback(
    (state: boolean): void => dispatch(setShowTrail(state)),
    []
  )
  const dispatchSetSetSlowMo = useCallback(
    (state: boolean): void => dispatch(setSlowMo(state)),
    []
  )
  const dispatchSetVibrate = useCallback(
    (state: boolean): void => dispatch(setVibrate(state)),
    []
  )

  // https://www.react-spring.io/docs/hooks/use-trail
  const [trail, setTrail] = useTrail(SVGS.length, () => ({
    xy: [0, 0],
    opacity: showTrail ? 1 : 0,
    background: isDarkMode
      ? `rgba(10, 10, 10, 0.3)`
      : `rgba(255, 255, 255, 0.5)`,
    border: isDarkMode ? `1px dotted black` : `1px dotted white`,
    padding: isDarkMode ? 0 : 1,
    config: i => {
      return configs[i]
    },
  }))

  useEffect(() => {
    setTrail({
      background: isDarkMode
        ? `rgba(10, 10, 10, 0.3)`
        : `rgba(255, 255, 255, 0.5)`,
      border: isDarkMode ? `1px dotted black` : `1px dotted white`,
      padding: isDarkMode ? 0 : 1,
    })
  }, [isDarkMode])

  const bindMoveGesture = useMove(
    ({ event }) => {
      setTrail({
        xy: [event.pageX, event.pageY],
        opacity: showTrail ? 1 : 0,
        background: isDarkMode
          ? `rgba(10, 10, 10, 0.3)`
          : `rgba(255, 255, 255, 0.5)`,
        border: isDarkMode ? `1px dotted black` : `1px dotted white`,
        config: i => {
          return slowMo ? config.molasses : configs[i]
        },
      })
    },
    { domTarget: typeof window !== "undefined" && window }
  )
  useEffect(bindMoveGesture, [bindMoveGesture])

  useEffect(() => {
    const handleKeyPress = e => {
      switch (e.key) {
        case "s":
          return dispatchSetSetSlowMo(!slowMo)
        case "d":
          return dispatchSetIsDarkMode(!isDarkMode)
        case "t":
          return dispatchSetShowTrail(!showTrail)
        case "v":
          return dispatchSetVibrate(!vibrate)
        default:
          return
      }
    }

    typeof window !== "undefined" &&
      (() => {
        window.addEventListener("keypress", handleKeyPress)
      })()

    return () => {
      window.removeEventListener("keypress", handleKeyPress)
    }
  }, [isDarkMode, showTrail, slowMo, vibrate])

  return (
    <div className="withSVGTrail--HOC">
      {trail.map((props, index) => (
        <AnimatedSVG
          key={index}
          style={{
            ...props,
            /** interpolate util method 1 */
            // transform: interpolate([props.xy] props.padding, ([x, y], p) =>
            //   vibrate ? translate2dVibrate(x, y) : translate2d(x, y)
            // ),
            /** interpolate util method 2 */
            transform: interpolate(
              props.xy,
              vibrate ? translate2dVibrate : translate2d
            ),
            opacity: props.opacity.interpolate((x: number) => x),
            padding: props.padding
              .interpolate({
                range: [0, 0.25, 0.5, 0.75, 1],
                output: [5, 0, 9, 0, 5],
              })
              .interpolate((p: number) => `${(index + 1) * p}px`),
            zIndex: svgZ - index,
          }}
        >
          {SVGS[index]}
        </AnimatedSVG>
      ))}
      {children}
    </div>
  )
}

function withSVGTrail(BaseComponent) {
  return props => (
    <Wrapper>
      <BaseComponent {...props} />
    </Wrapper>
  )
}

export default withSVGTrail
