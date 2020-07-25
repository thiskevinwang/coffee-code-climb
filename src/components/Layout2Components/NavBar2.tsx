import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link } from "gatsby"
import styled, { css } from "styled-components"

import { rhythm } from "utils/typography"
import { navbarZ } from "consts"
import { ThemeSlider } from "components/ThemeSlider"
import { Button } from "components/Button"

import { setPostsVersion } from "_reduxState"

const flexRowAlignItemsCenter = css`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const justifyContentSpaceBetween = css`
  justify-content: space-between;
`

const Bar = styled.div`
  ${flexRowAlignItemsCenter};
  ${justifyContentSpaceBetween}
  padding: ${rhythm(0.5)};

  height: ${rhythm(2)};
  top: 0px;
  width: 100%;
  z-index: ${navbarZ};
`
const BarItem = styled.div`
  ${flexRowAlignItemsCenter};
`

/**
 * NavBar
 * Subscribed to a few redux state changes.
 * Also dispatches actions to update the store.
 */
const NavBar2 = () => {
  const postsVersion = useSelector((state) => state.postsVersion)
  const dispatch = useDispatch()

  useEffect(() => {
    const handleKeyUp = (e: React.KeyboardEvent) => {
      if (e.ctrlKey) {
        switch (e.keyCode) {
          case 49 /** 1 */:
            return dispatch(setPostsVersion(1))
          case 50 /** 2 */:
            return dispatch(setPostsVersion(2))
          default:
            return
        }
      }
    }

    /** add event listener */
    typeof window !== undefined && window.addEventListener("keyup", handleKeyUp)
    /** clean up event listener*/
    return () => {
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  return (
    <Bar>
      <BarItem>
        <Link to={"/rds"}>Comments (experimental ⚗️)</Link>
      </BarItem>
      <BarItem>
        <Button
          style={{
            fontWeight: 500,
            height: 36,
            padding: 0,
            paddingLeft: rhythm(0.5),
            paddingRight: rhythm(0.5),
            margin: 0,
            marginRight: rhythm(0.5),
            textDecoration: postsVersion === 1 ? "underline" : undefined,
          }}
          onClick={() => dispatch(setPostsVersion(1))}
        >
          V1
        </Button>
        <Button
          style={{
            fontWeight: 500,
            height: 36,
            padding: 0,
            paddingLeft: rhythm(0.5),
            paddingRight: rhythm(0.5),
            margin: 0,
            marginRight: rhythm(0.5),
            textDecoration: postsVersion === 2 ? "underline" : undefined,
          }}
          onClick={() => dispatch(setPostsVersion(2))}
        >
          V2
        </Button>
        <ThemeSlider />
      </BarItem>
    </Bar>
  )
}

export { NavBar2 }
