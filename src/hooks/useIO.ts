import { useRef, useEffect, useState, MutableRefObject } from "react"
import _ from "lodash"

// TODO: use this / figure out `window` issue during SSR
// import IntersectionObserver from 'intersection-observer-polyfill';

interface Options {
  /**
   * **root**
   *
   * The element that is used as the viewport for checking visiblity of the target.
   * Must be the ancestor of the target.
   * - Defaults to the browser viewport if not specified or if null.
   */
  root?: HTMLElement | null
  /**
   * **rootMargin**
   *
   * Margin around the root. Can have values similar to the CSS margin property,
   * e.g. "10px 20px 30px 40px" (top, right, bottom, left). The values can be
   * percentages. This set of values serves to grow or shrink each side of the
   * root element's bounding box before computing intersections.
   * - Defaults to all zeros.
   */
  rootMargin?: string
  /**
   * **threshold**
   *
   * Either a single number or an array of numbers which indicate at what
   * percentage of the target's visibility the observer's callback should be
   * executed. If you only want to detect when visibility passes the 50% mark,
   * you can use a value of 0.5. If you want the callback to run every time
   * visibility passes another 25%, you would specify the array
   * [0, 0.25, 0.5, 0.75, 1]. The default is 0 (meaning as soon as even one
   * pixel is visible, the callback will be run). A value of 1.0 means that
   * the threshold isn't considered passed until every pixel is visible.
   */
  threshold?: number | number[]
}

/**
 * # useIO
 * @param {{root: HTMLElement}} root
 * @param {{rootMargin: string}} rootMargin
 * @param {{threshold: number | number[]}} root
 * @usage
 * ```ts
 * const [isIntersecting, bind] = useIO(options?)
 * // ...
 * return <Sentinel {...bind}/>
 * ```
 */
function useIO(
  options: Options
): [boolean, { ref: MutableRefObject<undefined> }] {
  const ref = useRef()
  const [isIntersecting, setIsIntersecting] = useState(false)

  const defaultOptions = {
    root: null,
    rootMargin: `-100px 0px 100%`,
    threshold: 0.99,
  }
  const mergedOptions: Options = _.merge(defaultOptions, options)

  /**
   * Creating an IO is an expensive calculation so by passing a
   * callback to `useState`, this is only calculated on the
   * initial render. 👌
   *
   * https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
   */
  let [io] = useState(
    () =>
      typeof IntersectionObserver !== "undefined" &&
      new IntersectionObserver(([entry], observer) => {
        entry.isIntersecting
          ? setIsIntersecting(true)
          : setIsIntersecting(false)
      }, mergedOptions)
  )

  useEffect(() => {
    if (io) io.observe(ref.current)

    return () => {
      if (io) io.disconnect()
    }
  }, [io])

  return [isIntersecting, { ref }]
}

export default useIO
export { useIO }
