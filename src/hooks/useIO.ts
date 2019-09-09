import { useRef, useEffect, useState, MutableRefObject } from "react"

// TODO: use this / figure out `window` issue during SSR
// import IntersectionObserver from 'intersection-observer-polyfill';

type Options = {
  root: Element | null
  rootMargin: string
  threshold: number | number[]
}

// TODO:
// - add documentation
// - expose `options` argument
export default function useIO(): [
  boolean,
  { ref: MutableRefObject<undefined> }
] {
  const ref = useRef()
  const [isIntersecting, setIsIntersecting] = useState(false)

  const defaultOptions: Options = {
    root: null,
    rootMargin: `-100px 0px 100%`,
    threshold: 0.99,
  }

  /**
   * Creating an IO is an expensive calculation so by passing a
   * callback to `useState`, this is only calculated on the
   * initial render. 👌
   *
   * https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
   */
  let [io, setIo] = useState(null)

  useEffect(() => {
    setIo(
      () =>
        new IntersectionObserver(([entry], observer) => {
          entry.isIntersecting
            ? setIsIntersecting(true)
            : setIsIntersecting(false)
        }, defaultOptions)
    )
  }, [])
  useEffect(() => {
    if (io) io.observe(ref.current)

    return () => {
      if (io) io.disconnect()
    }
  }, [io])

  return [isIntersecting, { ref }]
}
