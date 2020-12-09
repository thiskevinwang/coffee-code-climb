import React from "react"
import { navigate } from "gatsby"
import { useLocation } from "@reach/router"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import BottomNavigation from "@material-ui/core/BottomNavigation"
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import HomeIcon from "@material-ui/icons/Home"
import PersonIcon from "@material-ui/icons/Person"
import SettingsIcon from "@material-ui/icons/Settings"
import useMediaQuery from "@material-ui/core/useMediaQuery"

import { SwipeableTemporaryDrawer } from "components/SwipeableTemporaryDrawer"
import { useVerifyTokenSet } from "utils"
import { Skeleton } from "@material-ui/lab"

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    width: "100%",
    bottom: 0,
    backgroundColor: "var(--accents-1)",
    borderTop: "1px solid var(--accents-2)",
    zIndex: theme.zIndex.appBar,
    "& .MuiBottomNavigationAction-root": {
      color: "var(--accents-4)",
      "&.Mui-selected": {
        color: "var(--geist-foreground)",
      },
    },
  },
}))

export const SimpleBottomNavigation = () => {
  const { pathname } = useLocation()

  const classes = useStyles()
  const theme = useTheme()
  const smUp = useMediaQuery(theme.breakpoints.up("sm"))
  const { isLoggedIn } = useVerifyTokenSet()

  const handleChange = (event, newValue: any) => {
    navigate(newValue)
  }

  if (smUp) return null

  if (isLoggedIn === null) {
    return <Skeleton animation="wave" />
  }

  /**
   * @WARN BottomNavigation doesn't detect onChange events, if
   * BottomNavigationAction children are nested in React Fragments
   */
  return (
    <BottomNavigation
      value={pathname}
      onChange={handleChange}
      showLabels={false}
      className={classes.root}
    >
      {/* LOGGED IN */}
      {isLoggedIn === true && (
        <BottomNavigationAction
          label="Profile"
          icon={<PersonIcon />}
          value="/app/profile"
        />
      )}
      {isLoggedIn === true && (
        <BottomNavigationAction
          label="Settings"
          icon={<SettingsIcon />}
          value="/app/settings"
        />
      )}
      {isLoggedIn === true && (
        <BottomNavigationAction
          label="Menu"
          icon={<SwipeableTemporaryDrawer />}
        />
      )}

      {/* LOGGED OUT */}
      {isLoggedIn === false && (
        <BottomNavigationAction label="Home" icon={<HomeIcon />} value="/" />
      )}
      {isLoggedIn === false && (
        <BottomNavigationAction
          label="Login"
          icon={<ExitToAppIcon />}
          value="/auth/login"
        />
      )}
    </BottomNavigation>
  )
}
