import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link, navigate } from "gatsby"
import { useApolloClient, gql } from "@apollo/client"
import { useSnackbar } from "notistack"

import SwipeableDrawer from "@material-ui/core/SwipeableDrawer"
import Divider from "@material-ui/core/Divider"
import Avatar from "@material-ui/core/Avatar"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import MuiButton from "@material-ui/core/Button"
import Box from "@material-ui/core/Box"
import InputBase from "@material-ui/core/InputBase"
import NativeSelect from "@material-ui/core/NativeSelect"
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles"
import { useVerifyTokenSet } from "utils"

import { Sun, Moon } from "icons"
import { setIsDarkMode, setCognito, RootState } from "_reduxState"

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
  listRoot: {
    color: "var(--geist-foreground)",
    paddingTop: 0,
    paddingBottom: "var(--geist-gap)",
  },
  drawerPaper: {
    background: "var(--geist-background)",
    borderTop: "1px solid var(--accents-4)",
    borderTopLeftRadius: "var(--geist-marketing-radius)",
    borderTopRightRadius: "var(--geist-marketing-radius)",
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
  nativeSelectIcon: {
    color: "var(--geist-foreground)",
  },
})

export const SwipeableTemporaryDrawer = () => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const { isDarkMode } = useSelector((state: RootState) => ({
    postsVersion: state.postsVersion,
    layoutVersion: state.layoutVersion,
    isDarkMode: state.isDarkMode,
  }))
  const dispatch = useDispatch()
  const { isLoggedIn, accessTokenPayload } = useVerifyTokenSet()
  const id = accessTokenPayload?.username
  const client = useApolloClient()
  const avatarUrl = client.readFragment({
    id: `User:${id}`,
    fragment: USER_AVATAR_URL_FRAGMENT,
  })?.avatar_url

  const handleClick = (event) => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const list = () => (
    <>
      <List classes={{ root: classes.listRoot }}>
        {isLoggedIn === true ? (
          <>
            <ListItem
              onClick={handleClose}
              classes={{ root: classes.menuItemRoot }}
              component={Link}
              activeStyle={menuItemLinkActiveStyle}
              to="/"
              disableRipple
            >
              Home
            </ListItem>

            <ListItem
              onClick={handleClose}
              classes={{ root: classes.menuItemRoot }}
              component={Link}
              activeStyle={menuItemLinkActiveStyle}
              to="/app/profile"
              disableRipple
            >
              Profile
            </ListItem>

            <ListItem
              onClick={handleClose}
              classes={{ root: classes.menuItemRoot }}
              component={Link}
              activeStyle={menuItemLinkActiveStyle}
              to="/app/settings"
              disableRipple
            >
              Settings
            </ListItem>

            <Box py={1}>
              <Divider classes={{ root: classes.divider }} />
            </Box>

            <ListItem
              onClick={(e) => e.preventDefault()}
              component="div"
              disableRipple
              classes={{ root: classes.menuItemRoot }}
            >
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
            </ListItem>

            <Box py={1}>
              <Divider classes={{ root: classes.divider }} />
            </Box>

            <ListItem
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
            </ListItem>
          </>
        ) : (
          <>
            <ListItem
              onClick={handleClose}
              classes={{ root: classes.menuItemRoot }}
              component={Link}
              activeStyle={menuItemLinkActiveStyle}
              to="/"
              disableRipple
            >
              Home
            </ListItem>
            <ListItem
              onClick={handleClose}
              classes={{ root: classes.menuItemRoot }}
              component={Link}
              activeStyle={menuItemLinkActiveStyle}
              to="/auth/login"
              disableRipple
            >
              Login
            </ListItem>
          </>
        )}
      </List>
    </>
  )

  return (
    <>
      <MuiButton disableRipple onClick={handleClick}>
        <Avatar src={avatarUrl} classes={{ root: classes.avatarRoot }} />
      </MuiButton>
      <SwipeableDrawer
        classes={{ paper: classes.drawerPaper }}
        anchor={"bottom"}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <DrawerHandle />
        {list()}
      </SwipeableDrawer>
    </>
  )
}

const DrawerHandle = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: "var(--geist-space-gap)",
      }}
    >
      <div
        style={{
          background: "var(--geist-foreground",
          height: "5px",
          width: "50%",
          borderRadius: "2.5px",
        }}
      />
    </div>
  )
}

const USER_AVATAR_URL_FRAGMENT = gql`
  fragment UserAvatar on User {
    avatar_url
  }
`
