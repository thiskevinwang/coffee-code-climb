import React, { useEffect } from "react"
import styled from "styled-components"
import { useSpring, animated } from "react-spring"
import { useScroll } from "react-use-gesture"
import { Link } from "gatsby"

import { rhythm } from "utils/typography"

const Container = styled(animated.div)`
  position: absolute;
  right: 0;
  margin-right: 20px;
  max-width: ${rhythm(12)};

  @media (max-width: 1200px) {
    position: relative;
    top: 0 !important;
  }

  li {
    list-style: none;
  }
  * {
    font-size: 12px;
  }
`

/**
 * @TODO figure out how to handle styling of individual elements inside
 * props.__html (aka tableOfContents)
 *
 * - use regex to manually add `class`, then inject styles via  `typography/index.js`
 *
 * @TODO smooth/spring scroll when clicking anchor links
 */
const TableOfContents = ({
  title,
  __html,
}: {
  title: string
  __html: string
}) => {
  const [{ top }, set] = useSpring(() => ({ top: 50 }))

  /**
   * some ideas
   */
  // const HTML = __html.replace(
  //   new RegExp(`${window.location.pathname}`, "g"),
  //   ``
  // )
  // const HTML = __html

  // console.log(HTML)
  // console.log(window.location.pathname)

  const HTML = __html.replace(/<a/g, `<a class="TOC__link"`)

  const bindScrollGesture = useScroll(
    state => {
      const { scrollTop } = state.event.target.documentElement

      set({
        top: scrollTop + 50,
        // onFrame: props => window.scroll(0, props.top),
      })
    },
    { domTarget: typeof window !== "undefined" && window }
  )
  useEffect(bindScrollGesture, [bindScrollGesture])

  /**
   * @TODO onFrame window.scroll doesn't seem to cooperate with bindScrollGesture...
   *
   * https://codesandbox.io/s/interesting-waterfall-pgo0y?from-embed
   */
  // useEffect(() => {
  //   const handleHashChange = e => {
  //     /**
  //      * @TODO need to intercept default jump-behavior
  //      * on hash change
  //      */
  //     set({
  //       top: e.target.scrollY,
  //       // from: { top: window.scrollY },
  //       // reset: true,
  //       onFrame: props => window.scroll(0, props.top),
  //     })
  //   }

  //   typeof window !== undefined &&
  //     window.addEventListener("hashchange", handleHashChange)
  //   return () => {
  //     window.removeEventListener("hashchange", handleHashChange)
  //   }
  // }, [])

  return (
    <Container style={{ top }}>
      <hr className="TOC__hr" />
      <p
        style={{
          textAlign: "center",
          marginTop: 20,
          marginBottom: 20,
          fontSize: 16,
        }}
      >
        TABLE OF CONTENTS
      </p>
      <hr className="TOC__hr" />
      <Link
        className={"TOC__link"}
        to={typeof window !== "undefined" && window.location.pathname}
      >
        {title}
      </Link>
      <div dangerouslySetInnerHTML={{ __html: HTML }} />
      <hr className="TOC__hr" />
    </Container>
  )
}

export { TableOfContents }
