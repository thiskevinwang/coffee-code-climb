import React, { useCallback, useState, useRef, useEffect } from "react"
import styled, { css } from "styled-components"
import { useSelector, useDispatch } from "react-redux"
import { animated, useSpring, config } from "react-spring"
import { useGesture } from "react-use-gesture"

import {
  setIsDarkMode,
  setLayoutVersion,
  setPostsVersion,
  setShowMobileMenu,
} from "_reduxState"
import { Button } from "components/Button"
import { rhythm, scale } from "utils/typography"
import * as Colors from "consts/Colors"
import { useMeasure } from "hooks/useMeasure"

const Renderer = styled(animated.div)`
  /* border: 1px solid red; */
  display: flex;
  flex-direction: column;
  padding-bottom: ${rhythm(1)};

  @media (min-width: 769px) {
    display: none;
  }
`

const Content = styled(animated.div)`
  will-change: transform, opacity, height;
  margin-right: 6px;
  overflow-x: hidden;
`

/**
 * usePrevious
 * @param {boolean} value
 */
export function usePrevious(value: boolean) {
  const ref: MutableRefObject<any> = useRef()
  useEffect(() => void (ref.current = value), [value])
  return ref.current
}

/**
 * # MobileMenu
 */
export const MobileMenu = ({ defaultOpen = false }) => {
  const { isDarkMode, layoutVersion, showMobileMenu } = useSelector(
    state => state
  )
  const postsVersion: 1 | 2 | 3 = useSelector(state => state.postsVersion)
  const dispatch = useDispatch()

  const dispatchSetIsDarkMode = useCallback(
    value => e => dispatch(setIsDarkMode(value)),
    []
  )
  const dispatchSetLayoutVersion = useCallback(
    value => e => dispatch(setLayoutVersion(value)),
    []
  )
  const dispatchSetPostsVersion = useCallback(
    value => e => dispatch(setPostsVersion(value)),
    []
  )

  const previous = usePrevious(showMobileMenu)

  /**
   * @usage where props normally go: `{...bind}`
   */
  const [bind, { height: viewHeight }] = useMeasure()

  const { height, opacity, transform } = useSpring({
    from: {
      height: 0,
      opacity: 0,
      // transform: "translate3d(20px,0,0)",
    },
    to: {
      height: showMobileMenu ? viewHeight + 50 : 0,
      opacity: showMobileMenu ? 1 : 0,
      // transform: `translate3d(${showMobileMenu ? 0 : 20}px,0,0)`,
    },
  })

  return (
    <Content
      style={{
        opacity,
        height: showMobileMenu && previous === showMobileMenu ? "auto" : height,
      }}
    >
      <Renderer style={{ transform }} {...bind}>
        <Button
          sm
          textSm
          isDarkMode={isDarkMode}
          onClick={dispatchSetIsDarkMode(!isDarkMode)}
        >
          <span>{`Dark Mode`}</span> <label>{isDarkMode ? "on" : "off"}</label>
        </Button>
        <Button
          sm
          textSm
          isDarkMode={isDarkMode}
          onClick={dispatchSetLayoutVersion((layoutVersion % 2) + 1)}
        >
          <span>{`Layout Version`}</span> <label>V{layoutVersion}</label>
        </Button>
        <Button
          sm
          textSm
          isDarkMode={isDarkMode}
          onClick={dispatchSetPostsVersion((postsVersion % 2) + 1)}
        >
          <span>{`Posts Version`}</span> <label>V{postsVersion}</label>
        </Button>
      </Renderer>
    </Content>
  )
}
