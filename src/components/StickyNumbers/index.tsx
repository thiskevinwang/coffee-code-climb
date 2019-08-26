import React, {
  useEffect,
  useCallback,
  useRef,
  useState,
  useMemo,
  MutableRefObject,
} from "react"
import "intersection-observer"
import {
  useSprings,
  useSpring,
  animated,
  AnimatedValue,
  config,
} from "react-spring"
import styled, { css } from "styled-components"
import _ from "lodash"

import useIO from "./useIO"
import { rhythm, scale } from "src/utils/typography"

const STICKY_STYLE = {
  // background: `red`,
  // width: 200,
  transform: `scale(1.5)`,
  // boxShadow: `0px 15px 30px 10px grey`,
  opacity: 0.9,
}
const INTERSECTING_STYLE = {
  // background: "green",
  // width: 200,
  transform: `scale(1)`,
  // boxShadow: `0px 10px 30px 1px grey `,
  opacity: 0,
}

type Arr = {
  ref: MutableRefObject<any>
  props: AnimatedValue<any>
}

// z-index & opacity
// https://stackoverflow.com/a/2849104/9823455

const Track = styled(animated.div)`
  position: absolute;
  right: 0%;
  padding-right: ${rhythm(0.5)};
`
const Container = styled(animated.div)`
  padding-top: 15px;
  padding-bottom: 20px;
  /* position: sticky;
  position: -webkit-sticky;
  top: 70px; */
  z-index: 10;
`
const StickyNumber = styled(animated.p)`
  /* background: red; */
  border-radius: 10px;
  font-size: 20px;
  font-weight: 100;
  text-align: center;
  /* padding: 35px; */
  position: sticky;
  position: -webkit-sticky;
  top: 80px;
  z-index: 10;
`

/** divide the page up into these many divisions */
const DIVISIONS = 10
/** a  */
const ARRAY_FROM_DIVISIONS = Array.from(Array(DIVISIONS))

/** !!! MAIN COMPONENT !!! */
const StickyNumbers = () => {
  /**
   * stateful height
   * window / document appear to be initially undefined
   * This gets set in useEffect
   */
  const [scrollHeight, setHeight] = useState(
    document.documentElement.scrollHeight
  )
  const [isScrolling, setIsScrolling] = useState(false)

  /**
   * The height of each 'section'
   * These is needed for the parent of a `sticky` element
   */
  const sectionHeight = Math.floor(scrollHeight / DIVISIONS)

  /**
   * # arr
   * An array of objects with the following properties... + others
   * @property {MutableRefObject} ref refs to be attached to targets to be observed by IntersectionObeservers (useIO)
   * @property {AnimatedValue} props
   */
  const arr: Arr[] = ARRAY_FROM_DIVISIONS.map(e => {
    const [isIntersecting, ref] = useIO()

    // Here are some other ideas.
    // const [showDebug, setShowDebug] = useState(false)
    // const toggleDebug = useCallback(() => setShowDebug(s => !s), [])

    const props = useSpring({
      to: isIntersecting
        ? {
            ...INTERSECTING_STYLE,
            opacity: isScrolling ? 0.8 : INTERSECTING_STYLE.opacity,
          }
        : {
            ...STICKY_STYLE,
            opacity: isScrolling ? 1 : STICKY_STYLE.opacity,
            transform: isScrolling ? `scale(1.7)` : STICKY_STYLE.transform,
          },
      config: config.default,
    })

    return { isIntersecting, ref, props }
  })

  // const foo: number = useMemo(
  //   () =>
  //     ((e: number): number => {
  //       console.log("computing...")
  //       return e
  //     })(1),
  //   []
  // )
  // console.log("foo", foo)

  /** debounced scroll-end handler */
  const reset = useCallback(
    _.debounce(() => {
      setIsScrolling(false)
    }, 200),
    []
  )
  /**
   * MOUNT EFFECT
   * + attach scroll eventListener
   * + clean up
   */
  useEffect(() => {
    setHeight(document.documentElement.scrollHeight)

    const handleScroll = () => {
      if (!isScrolling) setIsScrolling(true)
      reset()
    }

    typeof window !== "undefined" &&
      window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <Track>
      {arr.map(({ ref, props }, i: number) => {
        return (
          <Container
            key={i}
            ref={ref}
            style={{
              height: sectionHeight,
            }}
          >
            <StickyNumber style={props}>{`${i * 10}%`}</StickyNumber>
          </Container>
        )
      })}
    </Track>
  )
}

export { StickyNumbers }
