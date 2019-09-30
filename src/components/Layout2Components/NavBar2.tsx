import React, { useCallback } from "react"
import { Link } from "gatsby"
import styled, { css } from "styled-components"
import { useSelector, useDispatch } from "react-redux"

import { setIsDarkMode, setLayoutVersion, setPostsVersion } from "state"
import { rhythm } from "utils/typography"
import { Button } from "components/Button"
import * as Colors from "consts/Colors"
import { navbarZ, MUIBoxShadow } from "consts"

/**
 * Bar
 * A styled component that is our navbar.
 * @prop {boolean} isDarkMode - redux state
 */
const Bar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  height: 50px;
  position: -webkit-sticky;
  position: sticky;
  top: 0px;
  z-index: ${navbarZ};
`

/**
 * NavBar
 * Subscribed to a few redux state changes.
 * Also dispatches actions to update the store.
 */
const NavBar2 = () => {
  const rootPath: string = `${__PATH_PREFIX__}/`
  const { isDarkMode, layoutVersion } = useSelector(state => state)
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

  return (
    <Bar isDarkMode={isDarkMode}>
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
    </Bar>
  )
}

export { NavBar2 }
