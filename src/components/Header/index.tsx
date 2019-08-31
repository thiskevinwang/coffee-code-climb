import React, { useState, useRef, useMemo, memo } from "react"
import { Link } from "gatsby"
import { rhythm, scale } from "src/utils/typography"
import { useSpring, useTransition, useChain, a } from "react-spring"
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
  let data: { character: string; id: string; index: number }[] = useMemo(
    () =>
      Array.from(location.pathname === rootPath ? title : "Home").map(
        (e, i) => ({ character: e, id: uuid(), index: i })
      ),
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
    config: { mass: 4, tension: 150, friction: 12, velocity: 3 },
    from: ({ index }) => {
      const n: number = index - data.length / 2
      return {
        transform: `translate(${100 * n}px, -400px) scale(3) rotate(${n *
          90}deg)`,
      }
    },
    enter: { transform: `translate(0px, 0px) scale(1) rotate(0)` },
    // leave: { opacity: 1, transform: `translateY(-40px)` },
  })

  /** First run the spring, then run the transition, delayed 0.5s */
  useChain([transRef, springRef], [0, 1.5])

  /**
   * Use the animated props from the transition
   */
  const animatedTitle = transitions.map(({ item, key, props }) => (
    <a.div
      key={key}
      style={{
        ...props,
        lineHeight: 0.73,
        fontFamily: "Cereal",
      }}
    >
      {item.character}
    </a.div>
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
    header = <h3>{titleLink}</h3>
  }
  return header
}

// Since the props don't change, wrapping Header in `React.memo()`
// prevents it from rerendering when you update redux state
// Ex. `isDarkMode`

export default memo(Header)
