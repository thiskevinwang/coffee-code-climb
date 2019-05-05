import React, { useRef } from "react"
import { Link } from "gatsby"
import { rhythm, scale } from "@src/utils/typography"
import { useTransition, useChain, animated } from "react-spring"

export default function Header({
  location,
  title,
}: {
  location: Location
  title: string
}) {
  const rootPath: string = `${__PATH_PREFIX__}/`
  let header: JSX.Element

  /**
   * This is the array that gets passed to useTransition
   */
  let data: Array<string> = Array.from(title)
  /** Manually add emojis to the Title*/
  data.splice(17, 0, "🧗🏻‍♂️")
  data.splice(11, 0, "💻")
  data.splice(6, 0, "☕️")

  /** Build a spring and catch its ref. Here, no spring is used */
  const springRef = useRef()
  /** Build a transition and catch its ref */
  const transRef = useRef()

  /**
   * Transition animation. Comment out the ref to remove it from
   * the useChain call.
   */
  const transitions = useTransition(data, item => item, {
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
  const animatedTitle = transitions.map(({ item, key, props }, index) =>
    item !== " " ? (
      <AnimatedDiv
        className={`character ${
          item === "C" ? "character--start" + index : ""
        }`}
        key={`${key}-${index}`}
        style={{ ...props, lineHeight: 0.73 }}
      >
        {item}
        {/** Stagger `C`s, and text spacing based on breakpoint */}
        <style>{`
          .character {
            transition: margin-right 322ms ease-in-out, margin-left 322ms ease-in-out;
          }
          @media only screen and (min-width: 375px) {
            .character {
              margin-right: 5px;
            }
          }
          @media only screen and (min-width: 600px) {
            .character {
              margin-right: 20px;
            }
            .character--start8 {
              margin-left: 60px;
            }
            .character--start14 {
              margin-left: 120px;
            }
          }
          @media only screen and (min-width: 960px) {
            .character {
              margin-right: 30px;
            }
            .character--start8 {
              margin-left: 120px;
            }
            .character--start14 {
              margin-left: 240px;
            }
          }
        `}</style>
      </AnimatedDiv>
    ) : (
      /** A spacer when the array element is {" "} */
      <AnimatedDiv key={`space-${index}`} style={{ ...props, width: `100%` }} />
    )
  )

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
