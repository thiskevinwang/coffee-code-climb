import React, { useRef, useEffect, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { animated, useTrail, config, interpolate } from "react-spring"
import { useMove } from "react-use-gesture"
import styled from "styled-components"
import _ from "lodash"

import { svgZ } from "consts"
import { setIsDarkMode, RootState } from "_reduxState"
import { isBrowser } from "utils"
import * as SVG from "svg"

const SVGS = [SVG.REACT, SVG.APOLLO, SVG.Lambda, SVG.GRAPHQL, SVG.Rust]
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
  display: flex;
  pointer-events: none;
  position: absolute;
  z-index: 999;
`

// interpolation handler
// you can add _.random() in here for some weird behavior. (no rerenders!)
const translate2d = (x, y) =>
  `translate3d(${x}px,${y}px,0) translate3d(-50%,-50%,0)`

export const SvgTrail: React.ComponentType = ({ children }) => {
  /** instance variables */
  const slowMoRef = useRef(false)
  const showTrailRef = useRef(false)

  // Redux hooks
  const isDarkMode = useSelector((state: RootState) => state.isDarkMode)
  const dispatch = useDispatch()
  const dispatchSetIsDarkMode = useCallback(
    (state: boolean) => dispatch(setIsDarkMode(state)),
    []
  )

  // https://www.react-spring.io/docs/hooks/use-trail
  const [trail, setTrail] = useTrail(SVGS.length, () => ({
    xy: [0, 0],
    opacity: showTrailRef.current ? 1 : 0,
    boxShadow: "var(--shadow-medium)",
    background: isDarkMode
      ? `rgba(10, 10, 10, 0.3)`
      : `rgba(255, 255, 255, 0.5)`,
    padding: isDarkMode ? 0 : 1,
    /**
     * Config ref-based logic needs to be specified here in the initial spring declaration.
     * - Why?
     *   - If the component rerenders (ex. subscriptions to redux store), this hook
     * is re-evaluated, and falls back to `config.default` if not specified.
     */
    config: (i) => (slowMoRef.current ? config.molasses : configs[i]),
  }))

  useEffect(() => {
    setTrail({
      padding: isDarkMode ? 0 : 1,
    })
  }, [isDarkMode])

  const bindMoveGesture = useMove(
    ({
      last,
      /**
       * event is undefined when last === true
       */
      event,
      /**
       * The return value of this callback
       */
      memo,
    }) => {
      setTrail({
        xy: last ? memo : [event.pageX, event.pageY],
        opacity: showTrailRef.current ? 1 : 0,
        background: isDarkMode
          ? `rgba(10, 10, 10, 0.3)`
          : `rgba(255, 255, 255, 0.5)`,
      })
      return !last && [event.pageX, event.pageY]
    },
    { domTarget: isBrowser() ? window : null }
  )
  useEffect(bindMoveGesture, [bindMoveGesture])

  useEffect(() => {
    const handleKeyUp = (e: React.KeyboardEvent) => {
      if (e.ctrlKey) {
        switch (e.keyCode) {
          case 68 /** "d" */:
            /** this will trigger a component rerender */
            return dispatchSetIsDarkMode(!isDarkMode)
          case 83 /** "s" */:
            slowMoRef.current = !slowMoRef.current
            /**
             * Config needs to be updated here - for if an animation is still
             * in-progress/lingering, but the `useMove` gesture has finished.
             */
            setTrail({
              config: (i) => (slowMoRef.current ? config.molasses : configs[i]),
            })
            return
          case 84 /** "t" */:
            return (showTrailRef.current = !showTrailRef.current)
          default:
            return
        }
      }
    }

    isBrowser() && window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [isDarkMode])

  /**
   * changes in ref.current values don't get reflected in `return`
   * until the component rerenders
   * @see dispatchSetIsDarkMode
   */
  return (
    <div
      className="trail-container"
      style={{
        overflow: "hidden",
        height: "100%",
        width: "100%",
        position: "absolute",
        pointerEvents: "none",
      }}
    >
      {trail.map((props, index) => (
        <AnimatedSVG
          key={index}
          style={{
            ...props,
            transform: interpolate(props.xy, translate2d),
            // opacity: props.opacity.interpolate((x: number) => x),
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
