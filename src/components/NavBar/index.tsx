import React, { useCallback } from "react"
import styled, { BaseProps } from "styled-components"
import { useSelector, useDispatch } from "react-redux"

import {
  setIsDarkMode,
  setLayoutVersion,
  setPostsVersion,
  RootState,
} from "_reduxState"
import { Button } from "components/Button"
import * as Colors from "consts/Colors"
import { navbarZ } from "consts"

const Bar = styled.div`
  background: ${(props: BaseProps) =>
    props.theme.mode === "dark" ? Colors.blackDarker : Colors.silverLight};
  box-shadow: var(--shadow);
  color: white;
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
const NavBar = () => {
  // const rootPath = `${__PATH_PREFIX__}/`

  const { isDarkMode, layoutVersion, postsVersion } = useSelector(
    (state: RootState) => ({
      isDarkMode: state.isDarkMode,
      layoutVersion: state.layoutVersion,
      postsVersion: state.postsVersion,
    })
  )

  const dispatch = useDispatch()

  const dispatchSetIsDarkMode = useCallback(
    (value: boolean) => () => dispatch(setIsDarkMode(value)),
    []
  )
  const dispatchSetLayoutVersion = useCallback(
    (value: number) => () => dispatch(setLayoutVersion(value)),
    []
  )
  const dispatchSetPostsVersion = useCallback(
    (value: number) => () => dispatch(setPostsVersion(value)),
    []
  )

  return (
    <Bar>
      <Button onClick={dispatchSetIsDarkMode(!isDarkMode)}>
        <span>{`Dark Mode: `}</span>
        <label>{isDarkMode ? "🌙" : "☀️"}</label>
      </Button>
      <Button onClick={dispatchSetLayoutVersion((layoutVersion % 2) + 1)}>
        <span>{`Layout: `}</span>
        <label>V{layoutVersion}</label>
      </Button>
      <Button onClick={dispatchSetPostsVersion((postsVersion % 2) + 1)}>
        <span>{`Posts: `}</span>
        <label>V{postsVersion}</label>
      </Button>
    </Bar>
  )
}

export default NavBar
