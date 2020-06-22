import { useRef, useState, useEffect, RefObject } from "react"
import ResizeObserver from "resize-observer-polyfill"

interface Bounds {
  left: number
  top: number
  width: number
  height: number
}

/**
 * useMeasure
 *
 * @usage
 * ```js
 * const [bind, { height: viewHeight }] = useMeasure()
 * //...
 * <animated.div style={{ transform }} {...bind} children={children}>
 *   {children}
 * </animated.div>
 * ```
 */
export function useMeasure(): [{ ref: RefObject<any> }, Bounds] {
  const ref = useRef()

  const [bounds, set] = useState({ left: 0, top: 0, width: 0, height: 0 })

  const [ro] = useState(
    () => new ResizeObserver(([entry]) => set(entry.contentRect))
  )

  // ro.observe on mount, and clean up
  useEffect(() => {
    if (ref.current) ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  return [{ ref }, bounds]
}
