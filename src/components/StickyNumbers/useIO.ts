import { useRef, useEffect, useState } from "react"

export default function useIO() {
  const ref = useRef()
  const [isIntersecting, setIsIntersecting] = useState(false)

  let options = {
    root: null,
    rootMargin: `-70px 0px 100%`,
    threshold: 0.99,
  }
  let observer = new IntersectionObserver(([entry], observer) => {
    entry.isIntersecting ? setIsIntersecting(true) : setIsIntersecting(false)
  }, options)

  useEffect(() => {
    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  return [isIntersecting, ref]
}
