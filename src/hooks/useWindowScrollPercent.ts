import { useEffect } from "react"
import { useSpring, OpaqueInterpolation } from "react-spring"
import { useScroll } from "react-use-gesture"

import { isBrowser } from "utils"

/**
 * This hooks binds a scroll gesture listener to the window
 * object.
 *
 * @returns a `react-spring` "animated value", between 0-1.
 */
export const useWindowScrollPercent = (): [OpaqueInterpolation<number>] => {
  const [{ scrollPercent }, setScrollProps] = useSpring(() => ({
    scrollPercent: 0,
  }))

  const bindScrollGesture = useScroll(
    (state) => {
      // These two are the same
      // console.log("state", state.values[1])
      // console.log("window", window.document.scrollingElement.scrollTop)

      const { values } = state
      // const scrollTop = state?.event?.target?.documentElement?.scrollTop
      // const scrollHeight = state?.event?.target?.documentElement?.scrollHeight
      // const clientHeight = state?.event?.target?.documentElement?.clientHeight

      const scrollHeight: number =
        (isBrowser() && window.document.scrollingElement?.scrollHeight) || 0
      const clientHeight: number =
        (isBrowser() && window.document.scrollingElement?.clientHeight) || 0

      const scrollPercent = values[1] / (scrollHeight - clientHeight)

      setScrollProps({
        scrollPercent: isNaN(scrollPercent) ? 0 : scrollPercent,
      })
    },
    { domTarget: isBrowser() ? window : null }
  )
  useEffect(bindScrollGesture, [bindScrollGesture])

  return [scrollPercent]
}
