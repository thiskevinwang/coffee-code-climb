import React, {
  useEffect,
  useCallback,
  useRef,
  useState,
  useMemo,
  MutableRefObject,
} from "react"
import "intersection-observer"
import ResizeObserver from "resize-observer-polyfill"
import {
  useSprings,
  useSpring,
  animated,
  AnimatedValue,
  config,
} from "react-spring"
import styled, { css } from "styled-components"
import _ from "lodash"

import useIO from "../../hooks/useIO"
import { rhythm, scale } from "src/utils/typography"

const STICKY_STYLE = {
  transform: `scale(1.5) translate(50%, 0%)`,
  opacity: 0.9,
  background: `rgba(100,255,100,0.3)`,
}
const INTERSECTING_STYLE = {
  transform: `scale(1) translate(100%, 0%)`,
  opacity: 0,
  background: `rgba(255,100,100,0.3)`,
}
const MOUSE_OVER_STYLE = {
  transform: `scale(1.9) translate(0%, 0%)`,
  opacity: 0.9,
  background: `rgba(100,100,255,0.3)`,
}

type Arr = {
  bind: { ref: MutableRefObject<any> }
  props: AnimatedValue<any>
  setIsMouseOver: () => void
}

// z-index & opacity
// https://stackoverflow.com/a/2849104/9823455

const Container = styled(animated.div)`
  position: absolute;
  right: 0%;
  padding-right: ${rhythm(0.5)};
  /* border: 1px dotted red; */
`
const Sentinel = styled(animated.div)`
  padding-top: 5px;
  padding-bottom: 0px;
  z-index: 10;
`
const StickyNumber = styled(animated.p)`
  border-radius: 10px;
  font-size: 20px;
  font-weight: 100;
  text-align: center;
  padding-right: 5px;
  padding-left: 5px;
  position: sticky;
  position: -webkit-sticky;
  top: 85px;
  z-index: 10;
`

/** divide the page up into these many divisions */
const DIVISIONS = 10
/** an empty array  */
const ARRAY_FROM_DIVISIONS = Array.from(Array(DIVISIONS))

/** !!! MAIN COMPONENT !!! */
const StickyNumbers = () => {
  const [scrollHeight, setScrollHeight] = useState(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [ro] = useState(
    () =>
      new ResizeObserver(([entry]: [ResizeObserverEntry]) => {
        console.log(entry.target + " is resizing")
        setScrollHeight(entry.contentRect.height)
      })
  )

  /**
   * The shared height of each Sentinel
   * This is needed for the parent of a `sticky` element
   */
  const sentinelProps = useSpring({
    height: Math.floor(scrollHeight / DIVISIONS),
  })

  /**
   * # arr
   * An array of objects with the following properties... + others
   * @property {{ref: MutableRefObject}} bind refs to be attached to targets to be observed by IntersectionObeservers (useIO)
   * @property {AnimatedValue} props
   */
  const arr: Arr[] = ARRAY_FROM_DIVISIONS.map(e => {
    const [isIntersecting, bind] = useIO()
    const [isMouseOver, setIsMouseOver] = useState(false)

    /**
     * # individual spring props
     * for each array element
     *
     * ## 3 different styles
     * @MOUSE_OVER_STYLE when hovering
     * @INTERSECTING_STYLE when intersecting with the IO
     * @STICKY_STYLE when no longer intersecting (AKA sticky at top)
     *
     * @TODO make this object property overwriting neater
     */
    const props = useSpring({
      to: isMouseOver
        ? { ...MOUSE_OVER_STYLE }
        : isIntersecting
        ? {
            ...INTERSECTING_STYLE,
            opacity:
              isHovering || isScrolling ? 0.8 : INTERSECTING_STYLE.opacity,
            transform:
              isHovering || isScrolling
                ? `scale(1) translate(0%, 0%)`
                : INTERSECTING_STYLE.transform,
          }
        : {
            ...STICKY_STYLE,
            opacity: isHovering || isScrolling ? 1 : STICKY_STYLE.opacity,
            transform:
              isHovering || isScrolling
                ? `scale(1.7) translate(0%, 0%)`
                : STICKY_STYLE.transform,
          },
      config: config.wobbly,
    })

    return { isIntersecting, bind, props, setIsMouseOver }
  })

  /** debounced scroll-end handler */
  const reset = useCallback(
    _.debounce(() => {
      setIsScrolling(false)
    }, 700),
    []
  )

  useEffect(() => {
    ro.observe(document.documentElement)

    const handleScroll = () => {
      if (!isScrolling) setIsScrolling(true)

      reset()
    }

    typeof window !== "undefined" &&
      window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      ro.disconnect()
    }
  }, [])

  return (
    <Container
      onMouseEnter={() => {
        setIsHovering(true)
      }}
      onMouseLeave={() => {
        setIsHovering(false)
      }}
    >
      {arr.map(({ bind, props, setIsMouseOver }, i: number) => {
        return (
          <Sentinel key={i} {...bind} style={sentinelProps}>
            <StickyNumber
              onMouseEnter={() => {
                setIsMouseOver(true)
              }}
              onMouseLeave={() => {
                setIsMouseOver(false)
              }}
              style={props}
            >{`${(i * 100) / DIVISIONS}%`}</StickyNumber>
          </Sentinel>
        )
      })}
    </Container>
  )
}

export { StickyNumbers }
