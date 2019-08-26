import { useRef, useEffect, useState, MutableRefObject } from "react"

type Options = {
  root: Element | null
  rootMargin: string
  threshold: number | number[]
}

// TODO:
// - add documentation
// - expose `options` argument
export default function useIO(): [boolean, MutableRefObject<undefined>] {
  const ref = useRef()
  const [isIntersecting, setIsIntersecting] = useState(false)

  const defaultOptions: Options = {
    root: null,
    rootMargin: `-70px 0px 100%`,
    threshold: 0.99,
  }

  let observer = new IntersectionObserver(([entry], observer) => {
    entry.isIntersecting ? setIsIntersecting(true) : setIsIntersecting(false)
  }, defaultOptions)

  useEffect(() => {
    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  return [isIntersecting, ref]
}
