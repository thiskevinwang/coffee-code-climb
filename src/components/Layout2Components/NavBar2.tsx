import * as React from "react"
import styled from "styled-components"
import { rhythm } from "utils/typography"
import { navbarZ } from "consts"
import { ThemeSlider } from "components/ThemeSlider"

const Bar = styled.div`
  padding: ${rhythm(0.5)};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  height: ${rhythm(2)};
  top: 0px;
  width: 100%;
  z-index: ${navbarZ};
`

/**
 * NavBar
 * Subscribed to a few redux state changes.
 * Also dispatches actions to update the store.
 */
const NavBar2 = () => {
  const rootPath: string = `${__PATH_PREFIX__}/`

  return (
    <Bar>
      <ThemeSlider />
    </Bar>
  )
}

export { NavBar2 }
