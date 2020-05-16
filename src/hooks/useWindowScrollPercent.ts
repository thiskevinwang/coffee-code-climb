import * as React from "react"
import { useSpring, OpaqueInterpolation } from "react-spring"
import { useScroll } from "react-use-gesture"

/**
 * This hooks binds a scroll gesture listener to the window
 * object.
 *
 * @returns a `react-spring` "animated value", between 0-1.
 */
export const useWindowScrollPercent = (): OpaqueInterpolation<number>[] => {
  const [{ scrollPercent }, setScrollProps] = useSpring(() => ({
    scrollPercent: 0,
  }))

  const bindScrollGesture: React.EffectCallback = useScroll(
    (state) => {
      // These two are the same
      // console.log("state", state.values[1])
      // console.log("window", window.document.scrollingElement.scrollTop)

      const { values } = state
      // const scrollTop = state?.event?.target?.documentElement?.scrollTop
      // const scrollHeight = state?.event?.target?.documentElement?.scrollHeight
      // const clientHeight = state?.event?.target?.documentElement?.clientHeight

      const scrollHeight: number =
        typeof window !== "undefined" &&
        window.document.scrollingElement.scrollHeight
      const clientHeight: number =
        typeof window !== "undefined" &&
        window.document.scrollingElement.clientHeight

      // console.log(scrollTop / (scrollHeight - clientHeight))
      setScrollProps({
        scrollPercent: values[1] / (scrollHeight - clientHeight),
      })
    },
    { domTarget: typeof window !== "undefined" && window }
  )
  React.useEffect(bindScrollGesture, [bindScrollGesture])

  return [scrollPercent]
}
