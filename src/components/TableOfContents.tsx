import React, { useEffect } from "react"
import styled from "styled-components"
import { useSpring, animated } from "react-spring"
import { useScroll } from "react-use-gesture"
import { Link } from "gatsby"

import { rhythm } from "utils/typography"

const DesktopContainer = styled(animated.div)`
  position: absolute;
  right: 0;
  margin-right: 20px;
  max-width: ${rhythm(12)};

  @media (max-width: 1200px) {
    display: none;
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
    <DesktopContainer style={{ top }}>
      <p style={{ textAlign: "center", marginBottom: 20, fontSize: 20 }}>
        Table of Contents
      </p>
      <Link to={window.location.pathname}>{title}</Link>
      <div dangerouslySetInnerHTML={{ __html }} />
    </DesktopContainer>
  )
}

export { TableOfContents }
