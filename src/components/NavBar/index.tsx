import React, { useCallback } from "react"
import { Link } from "gatsby"
import styled, { css } from "styled-components"
import { useSelector, useDispatch } from "react-redux"

import { setIsDarkMode, setShowTrail, setSlowMo } from "src/state"
import { rhythm } from "src/utils/typography"
import { Button } from "components/Button"
import * as Colors from "consts/Colors"
import { navbarZ, MUIBoxShadow } from "consts"

/**
 * Bar
 * A styled component that is our navbar.
 * @prop {boolean} isDarkMode - redux state
 */
const Bar = styled.div`
  background: ${props =>
    props.isDarkMode ? Colors.blackDarker : Colors.silverLight};
  box-shadow: ${MUIBoxShadow};
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
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
  const rootPath: string = `${__PATH_PREFIX__}/`
  const { isDarkMode, slowMo, showTrail } = useSelector(state => state)
  const dispatch = useDispatch()

  const dispatchSetIsDarkMode = useCallback(
    state => dispatch(setIsDarkMode(state)),
    []
  )
  const dispatchSetSetSlowMo = useCallback(
    state => dispatch(setSlowMo(state)),
    []
  )
  const dispatchSetShowTrail = useCallback(
    state => dispatch(setShowTrail(state)),
    []
  )

  return (
    <Bar isDarkMode={isDarkMode}>
      <Button
        sm
        textSm
        isDarkMode={isDarkMode}
        onClick={e => {
          dispatchSetIsDarkMode(!isDarkMode)
        }}
      >
        <span>{`Dark Mode`}</span>
      </Button>
    </Bar>
  )
}

export default NavBar
