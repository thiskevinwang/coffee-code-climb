import * as React from "react"
import "intersection-observer"
import ResizeObserver from "resize-observer-polyfill"
import {
  useSpring,
  animated,
  config,
  /** types */
  AnimatedValue,
  OpaqueInterpolation,
} from "react-spring"
import { useScroll, useHover, useGesture } from "react-use-gesture"
import { ReactEventHandlers } from "react-use-gesture/dist/types"
import styled from "styled-components"
import _ from "lodash"

import useIO from "hooks/useIO"
import { rhythm } from "utils/typography"

// TODO: FIX THE OVERFLOW FOR MOBILE
const STICKY_STYLE = {
  transform: `scale(1.3)`,
  opacity: 0.9,
  background: `rgba(100,255,100)`,
}
const INTERSECTING_STYLE = {
  transform: `scale(1)`,
  opacity: 0,
  background: `rgba(255,100,100)`,
}
const MOUSE_OVER_STYLE = {
  transform: `scale(1.5)`,
  opacity: 0.9,
  background: `rgba(100,100,255)`,
}

type Arr = {
  bind: { ref: React.MutableRefObject<any> }
  props: AnimatedValue<any>
  bindHoverProps: (...args: any[]) => ReactEventHandlers
  bindDragProps: (...args: any[]) => ReactEventHandlers
  xy: OpaqueInterpolation<number[]>
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
  border-radius: 5px;
  cursor: move;
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
  const [isScrolling, setIsScrolling] = React.useState(false)
  const [isHovering, setIsHovering] = React.useState(false)

  /**
   * The shared height of each Sentinel
   * This is needed for the parent of a `sticky` element
   */
  const [sentinelProps, setSentinelProps] = useSpring(() => ({
    height: 0,
  }))
  const [ro] = React.useState(
    () =>
      new ResizeObserver(([entry]: [ResizeObserverEntry]) => {
        console.log(entry.target + " is resizing")
        setSentinelProps({
          height: Math.floor(entry.contentRect.height / DIVISIONS),
        })
      })
  )
  React.useEffect(() => {
    ro.observe(document.documentElement)
    return () => {
      ro.disconnect()
    }
  }, [ro])

  /**
   * # arr
   * An array of objects with the following properties... + others
   * @property {{ref: MutableRefObject}} bind refs to be attached to targets to be observed by IntersectionObeservers (useIO)
   * @property {AnimatedValue} props
   */
  const arr: Arr[] = ARRAY_FROM_DIVISIONS.map(e => {
    const [isIntersecting, bind] = useIO()
    const [isMouseOver, setIsMouseOver] = React.useState(false)
    const [isDragging, setIsDragging] = React.useState(false)

    /** spring props for `useDrag` */
    const [{ xy }, setXY] = useSpring(() => ({
      xy: [0, 0],
      config: config.wobbly,
    }))

    /**
     * @usage <animated.div {...bindDragProps()} />
     */
    const bindDragProps = useGesture({
      onDrag: ({
        down,
        delta: [dX, dY],
        event,
        memo = xy.getValue(),
        // I didn't know you could do this!
        // memo: [mX, my] = xy.getValue(),
      }) => {
        event.preventDefault()

        const [mX, mY] = memo

        setXY({ xy: [dX + mX, dY + mY] })
        setIsDragging(down)
        return memo
      },
    })

    const bindHoverProps = useHover(({ hovering }) => {
      setIsMouseOver(hovering)
    })

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
      to:
        isMouseOver || isDragging
          ? { ...MOUSE_OVER_STYLE }
          : isIntersecting
          ? {
              ...INTERSECTING_STYLE,
              opacity:
                isHovering || isScrolling || isDragging
                  ? 0.8
                  : INTERSECTING_STYLE.opacity,
              transform:
                isHovering || isScrolling || isDragging
                  ? `scale(1)`
                  : INTERSECTING_STYLE.transform,
            }
          : {
              ...STICKY_STYLE,
              opacity:
                isHovering || isScrolling || isDragging
                  ? 1
                  : STICKY_STYLE.opacity,
              transform:
                isHovering || isScrolling || isDragging
                  ? `scale(1.4)`
                  : STICKY_STYLE.transform,
            },
      config: config.wobbly,
    })

    return {
      isIntersecting,
      bind,
      props,
      bindHoverProps,
      bindDragProps,
      xy,
    }
  })

  /** debounced scroll-end handler */
  const reset = React.useCallback(
    _.debounce(() => {
      setIsScrolling(false)
    }, 700),
    []
  )
  /**
   * bindScrollGesture
   *
   * A scroll-gesture handler for the `window`
   */
  const bindScrollGesture = useScroll(
    state => {
      if (state.scrolling) setIsScrolling(state.scrolling)
      if (!state.scrolling) reset()
    },
    { domTarget: typeof window !== "undefined" && window }
  )
  React.useEffect(bindScrollGesture, [bindScrollGesture])

  const containerRef = React.useRef(null)
  const bindContainerProps = useHover(
    state => {
      console.log(state)
      setIsHovering(state.hovering)
    },
    { domTarget: containerRef }
  )
  return (
    <Container ref={containerRef} {...bindContainerProps()}>
      {arr.map(
        ({ bind, props, bindHoverProps, bindDragProps, xy }, i: number) => {
          return (
            <Sentinel
              key={i}
              {...bind}
              {...bindDragProps()}
              style={{
                ...sentinelProps,
                transform: xy.interpolate(
                  (x, y) => `translate3D(${x}px, ${y}px, 0)`
                ),
              }}
            >
              <StickyNumber {...bindHoverProps()} style={props}>{`${(i * 100) /
                DIVISIONS}%`}</StickyNumber>
            </Sentinel>
          )
        }
      )}
    </Container>
  )
}

export { StickyNumbers }
