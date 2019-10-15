import React, { useEffect } from "react"
import styled from "styled-components"
import { useSpring, animated } from "react-spring"
import { useScroll } from "react-use-gesture"
import { Link } from "gatsby"

const DesktopContainer = styled(animated.div)`
  position: absolute;
  right: 0;
  margin-right: 20px;

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
const TableOfContents = ({ title, __html }) => {
  const [{ top }, set] = useSpring(() => ({ top: 50 }))

  const bindScrollGesture = useScroll(
    state => {
      const { scrollTop } = state.event.target.documentElement

      set({
        top: scrollTop + 50,
      })
    },
    { domTarget: typeof window !== "undefined" && window }
  )
  useEffect(bindScrollGesture, [bindScrollGesture])

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
