import React, { useRef, useMemo, memo } from "react"
import { Link } from "gatsby"
import { rhythm, scale } from "src/utils/typography"
import { useTransition, useChain, animated } from "react-spring"
import uuid from "uuid/v4"

function Header({ location, title }: { location: Location; title: string }) {
  const rootPath: string = `${__PATH_PREFIX__}/`
  let header: JSX.Element

  /**
   * This is the array that gets passed to useTransition
   *
   * If you DO NOT wrap it in React.useMemo(), then clicking on the
   * <Link/> component causes the entire component, or App(?)
   * to rerender... which ends up generating a bunch of duplicates.
   */
  let data: Array<{ character: string; id: string }> = useMemo(
    () => Array.from(title).map(e => ({ character: e, id: uuid() })),
    []
  )

  /** Build a spring and catch its ref. Here, no spring is used */
  const springRef = useRef()
  /** Build a transition and catch its ref */
  const transRef = useRef()

  /**
   * Transition animation. Comment out the ref to remove it from
   * the useChain call.
   */

  const transitions = useTransition(data, item => item.id, {
    ref: transRef,
    unique: true,
    trail: 500 / data.length,
    config: { mass: 2, tension: 150, friction: 8, velocity: 10 },
    from: { transform: `translateY(-400px)` },
    enter: { transform: `translateY(0px)` },
    // leave: { opacity: 1, transform: `translateY(-40px)` },
  })

  /** First run the spring, then run the transition, delayed 0.5s */
  useChain([springRef, transRef], [0, 0.5])

  /**
   * A react-spring wrapper for a div element.
   * Wraps each individual character from siteMetadata.title, aka props.title
   */
  const AnimatedDiv = animated.div

  /**
   * Use the animated props from the transition
   */
  const animatedTitle = transitions.map(({ item, key, props }) => (
    <AnimatedDiv key={key} style={{ ...props, lineHeight: 0.73 }}>
      {item.character}
    </AnimatedDiv>
  ))

  /** A container for the animatedTitle */
  const titleLink: JSX.Element = (
    <Link
      style={{
        display: "flex",
        flexFlow: "row wrap",
        boxShadow: `none`,
        textDecoration: `none`,
        color: `inherit`,
      }}
      to={`/`}
    >
      {animatedTitle}
    </Link>
  )

  if (location.pathname === rootPath) {
    header = (
      <h1
        style={{
          ...scale(1.5),
          marginBottom: rhythm(1),
        }}
      >
        {titleLink}
      </h1>
    )
  } else {
    header = (
      <h3
        style={{
          fontFamily: `Montserrat, sans-serif`,
        }}
      >
        {titleLink}
      </h3>
    )
  }
  return header
}

// Since the props don't change, wrapping Header in `React.memo()`
// prevents it from rerendering when you update redux state
// Ex. `isDarkMode`

export default memo(Header)
