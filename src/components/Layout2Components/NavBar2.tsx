import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link, navigate } from "gatsby"
import { Skeleton } from "@material-ui/lab"
import styled, { css } from "styled-components"

import { rhythm } from "utils/typography"
import { navbarZ } from "consts"
import { ThemeSlider } from "components/ThemeSlider"
import { Button } from "components/Button"

import { setPostsVersion, setCognito, RootState } from "_reduxState"
import { useVerifyTokenSet } from "utils"
import { useCognito } from "utils/Playground/useCognito"

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
  const postsVersion = useSelector((state: RootState) => state.postsVersion)
  const dispatch = useDispatch()
  const { isLoggedIn, decoded } = useVerifyTokenSet()

  return (
    <Bar>
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
      <BarItem>
        {isLoggedIn === true && (
          <>
            <a
              href="/playground"
              onClick={async (event) => {
                event.preventDefault()
                dispatch(setCognito(null, null))
                navigate(`/auth/login`)
              }}
            >
              Logout
            </a>

            <span>&nbsp;|&nbsp;Hello, {decoded?.email}</span>
          </>
        )}
        {isLoggedIn === false && <Link to={"/auth/login"}>Login</Link>}
        {isLoggedIn === null && <Skeleton variant="text" width={"5ch"} />}
      </BarItem>
    </Bar>
  )
}

export { NavBar2 }
