import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link, navigate } from "gatsby"
import { useSnackbar } from "notistack"
import { useApolloClient, gql } from "@apollo/client"

import { Skeleton } from "@material-ui/lab"
import Avatar from "@material-ui/core/Avatar"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import MuiButton from "@material-ui/core/Button"
import Divider from "@material-ui/core/Divider"
import Fade from "@material-ui/core/Fade"
import Box from "@material-ui/core/Box"
import Tooltip from "@material-ui/core/Tooltip"
import InputBase from "@material-ui/core/InputBase"
import NativeSelect from "@material-ui/core/NativeSelect"
import { makeStyles, withStyles } from "@material-ui/core/styles"

import styled, { css } from "styled-components"

import { rhythm } from "utils/typography"
import { navbarZ } from "consts"
import { ThemeSlider } from "components/ThemeSlider"
import { Button } from "components/Button"

import { Sun, Moon } from "icons"

import {
  setIsDarkMode,
  setPostsVersion,
  setLayoutVersion,
  setCognito,
  RootState,
} from "_reduxState"
import { useVerifyTokenSet } from "utils"

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

const BootstrapInput = withStyles((theme) => ({
  input: {
    borderRadius: 4,
    color: "var(--geist-foreground)",
    position: "relative",
    backgroundColor: "var(--geist-background)",
    border: "1px solid var(--accents-2)",
    padding: "0 var(--geist-space-8x)",
    // Use the system font instead of the default Roboto font.
    fontFamily: "var(--font-sans)",
    fontSize: "14px",
    height: "var(--geist-space-8x)",
    "&:focus": {
      borderRadius: 4,
      boxShadow: "0 0 0 1px var(--geist-selection)",
    },
  },
}))(InputBase)

const menuItemLinkActiveStyle = {
  color: "var(--geist-foreground)",
  background: "var(--accents-1)",
}

const useStyles = makeStyles({
  paper: {
    background: "var(--geist-background)",
    boxShadow: "var(--shadow-medium)",
    color: "var(--geist-foreground)",
  },
  menuItemRoot: {
    fontFamily: "var(--font-sans)",
    fontSize: "14px",
    color: "var(--accents-5)",
    boxShadow: "none",
    "&:hover": menuItemLinkActiveStyle,
  },
  avatarRoot: {
    width: 38,
    height: 38,
    border: `2px solid var(--accents-2)`,
    "& .MuiAvatar-img": { marginBottom: 0 },
  },
  divider: {
    background: "var(--accents-2)",
  },
  tooltip: {
    backgroundColor: "var(--accents-2)",
    color: "var(--accents-7)",
    fontFamily: "var(--font-sans)",
  },
  arrow: {
    color: "var(--accents-2)",
  },
  nativeSelectIcon: {
    color: "var(--geist-foreground)",
  },
})

/**
 * NavBar2
 * Subscribed to a few redux state changes.
 * Also dispatches actions to update the store.
 */
const NavBar2 = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { postsVersion, layoutVersion, isDarkMode } = useSelector(
    (state: RootState) => ({
      postsVersion: state.postsVersion,
      layoutVersion: state.layoutVersion,
      isDarkMode: state.isDarkMode,
    })
  )
  const dispatch = useDispatch()
  const { isLoggedIn, accessTokenPayload } = useVerifyTokenSet()
  const id = accessTokenPayload?.username
  const client = useApolloClient()

  /** this will be null if refreshing on a non /app route */
  const avatarUrl = client.readFragment({
    id: `User:${id}`,
    fragment: USER_AVATAR_URL_FRAGMENT,
  })?.avatar_url

  const [anchorEl, setAnchorEl] = React.useState(null)

  const classes = useStyles()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Bar>
      <BarItem>
        <Tooltip
          classes={{ tooltip: classes.tooltip, arrow: classes.arrow }}
          arrow
          title={
            <>
              Toggle the "Posts" style version.
              <br />
              Only the home page <code>/</code> will be affected
            </>
          }
        >
          <Box mr={1}>
            <Button
              onClick={() => dispatch(setPostsVersion((postsVersion % 2) + 1))}
            >
              P{postsVersion}
            </Button>
          </Box>
        </Tooltip>
        <Tooltip
          classes={{ tooltip: classes.tooltip, arrow: classes.arrow }}
          arrow
          title={<>Toggle the "Layout" version</>}
        >
          <Box mr={1}>
            <Button
              onClick={() =>
                dispatch(setLayoutVersion((layoutVersion % 2) + 1))
              }
            >
              L{layoutVersion}
            </Button>
          </Box>
        </Tooltip>
        <Tooltip
          classes={{ tooltip: classes.tooltip, arrow: classes.arrow }}
          arrow
          title={
            <>
              Toggle between <code>light</code> and <code>dark</code> mode
              <br />
              You can also press <kbd>Ctrl</kbd> + <kbd>d</kbd>
            </>
          }
        >
          <Box>
            <ThemeSlider />
          </Box>
        </Tooltip>
      </BarItem>
      <BarItem>
        {isLoggedIn === null && (
          <Skeleton animation="wave" variant="text" width={"5ch"} />
        )}
        {isLoggedIn === false && (
          <>
            <Box mr={2}>
              <Link activeStyle={{ cursor: "not-allowed" }} to={"/"}>
                Home
              </Link>
            </Box>
            <Box>
              <Link activeStyle={{ cursor: "not-allowed" }} to={"/auth/login"}>
                Login
              </Link>
            </Box>
          </>
        )}
        {isLoggedIn === true && (
          <>
            <MuiButton disableRipple onClick={handleClick}>
              <Avatar src={avatarUrl} classes={{ root: classes.avatarRoot }} />
            </MuiButton>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              TransitionComponent={Fade}
              classes={{ paper: classes.paper }}
            >
              <MenuItem
                onClick={handleClose}
                classes={{ root: classes.menuItemRoot }}
                component={Link}
                activeStyle={menuItemLinkActiveStyle}
                to="/"
                disableRipple
              >
                Home
              </MenuItem>

              <MenuItem
                onClick={handleClose}
                classes={{ root: classes.menuItemRoot }}
                component={Link}
                activeStyle={menuItemLinkActiveStyle}
                to="/app/profile"
                disableRipple
              >
                Profile
              </MenuItem>

              <MenuItem
                onClick={handleClose}
                classes={{ root: classes.menuItemRoot }}
                component={Link}
                activeStyle={menuItemLinkActiveStyle}
                to="/app/settings"
                disableRipple
              >
                Settings
              </MenuItem>

              <Box py={1}>
                <Divider classes={{ root: classes.divider }} />
              </Box>

              <MenuItem disableRipple classes={{ root: classes.menuItemRoot }}>
                <Box marginRight={1.5}>Theme:</Box>
                <Box position="relative">
                  <NativeSelect
                    value={isDarkMode ? "dark" : "light"}
                    variant="outlined"
                    onChange={(e) =>
                      dispatch(setIsDarkMode(e.currentTarget.value === "dark"))
                    }
                    input={<BootstrapInput />}
                    classes={{ icon: classes.nativeSelectIcon }}
                  >
                    <option value={"dark"}>Dark</option>
                    <option value={"light"}>Light</option>
                  </NativeSelect>
                  <Box
                    alignItems="center"
                    display="flex"
                    position="absolute"
                    top="0"
                    left="5px"
                    height="100%"
                    style={{
                      pointerEvents: "none",
                    }}
                  >
                    {isDarkMode ? <Moon /> : <Sun />}
                  </Box>
                </Box>
              </MenuItem>

              <Box py={1}>
                <Divider classes={{ root: classes.divider }} />
              </Box>

              <MenuItem
                onClick={async () => {
                  handleClose()
                  enqueueSnackbar("Logged out successfully", {
                    variant: "success",
                  })
                  dispatch(setCognito(null, null))
                  await navigate(`/auth/login`)
                }}
                classes={{ root: classes.menuItemRoot }}
                disableRipple
              >
                Logout
              </MenuItem>
            </Menu>
          </>
        )}
      </BarItem>
    </Bar>
  )
}

const USER_AVATAR_URL_FRAGMENT = gql`
  fragment UserAvatar on User {
    avatar_url
  }
`

export { NavBar2 }
