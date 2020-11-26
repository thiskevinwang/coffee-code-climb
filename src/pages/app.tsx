import React from "react"
import { navigate, PageProps, Link } from "gatsby"
import { Router } from "@reach/router"
import Avatar from "@material-ui/core/Avatar"
import Button from "@material-ui/core/Button"
import ButtonGroup from "@material-ui/core/ButtonGroup"
import Box from "@material-ui/core/Box"
import { makeStyles } from "@material-ui/core/styles"
import styled, { css, createGlobalStyle } from "styled-components"

import { LayoutManager } from "components/layoutManager"
import { LoadingPage } from "components/LoadingPage"

import { Profile, Settings, Default } from "components/App"

import { useVerifyTokenSet } from "utils"

const ACTIVE_LINK = "ACTIVE_LINK"
const useStyles = makeStyles((theme) => {
  return {
    paperRoot: {
      background: "var(--geist-background)",
      boxShadow: "var(--shadow-medium)",
      display: "flex",
      flexDirection: "column",
    },
    groupedOutlined: {
      borderColor: "var(--accents-2)",
      "&:hover": {
        background: "var(--accents-1)",
      },
    },
    buttonRoot: {
      fontFamily: "var(--font-sans)",
      fontWeight: "normal",
      color: "var(--accents-5)",
      transition: theme.transitions.create(["color"], {
        easing: theme.transitions.easing.easeInOut,
      }),
      "&:hover": {
        color: "var(--geist-foreground)",
      },
      /** @see https://stackoverflow.com/a/53772369/9823455 */

      [`&.${ACTIVE_LINK}`]: {
        color: "var(--geist-foreground)",
        "&::before": {
          content: '""',
          display: "block",
          position: "absolute",
          height: 0,
          left: "9px",
          right: "9px",
          bottom: 0,
          borderBottom: "2px solid",
        },
      },
    },
    divider: {
      background: "var(--accents-2)",
    },
    avatarRoot: {
      height: "var(--geist-space-24x)",
      width: "var(--geist-space-24x)",
    },
  }
})

const AppOverrideStyles = createGlobalStyle`
  h1, h2, h3, h4, h5, h6, p, pre {
    margin: unset;
  }
  p {
    margin: var(--geist-space-gap-half) 0;
  }
`

const breakoutFromMaxWidth = css`
  --negative-gap: calc(var(--geist-gap) * -1);
  --two-gap: calc(2 * var(--geist-gap));
  --max: var(--geist-page-width-with-margin);

  --negative-margin: min(
    calc((100vw - min(100vw, calc(var(--max) - var(--two-gap)))) / -2),
    var(--negative-gap)
  );
  margin-left: var(--negative-margin);
  margin-right: var(--negative-margin);
`
const AppHeader = styled.header`
  ${breakoutFromMaxWidth}

  background: var(--geist-background);
  border-bottom: 1px solid var(--accents-2);
`

const AppBody = styled.div`
  ${breakoutFromMaxWidth}
  background: var(--accents-1);
`

/**
 * Anything at `/app/*` requires the user to be authenticated
 */
const App = ({ location }: PageProps) => {
  const { isLoggedIn, idTokenPayload, accessTokenPayload } = useVerifyTokenSet()
  const classes = useStyles()

  if (isLoggedIn === null) {
    return <LoadingPage />
  }
  if (isLoggedIn === false) {
    navigate("/auth/login")
    return null
  }
  return (
    <>
      <AppOverrideStyles />
      <LayoutManager location={location}>
        <Box py={2}>
          <ButtonGroup
            disableRipple
            variant="outlined"
            classes={{
              groupedOutlined: classes.groupedOutlined,
            }}
          >
            <Button
              classes={{ root: classes.buttonRoot }}
              component={Link}
              to="/app/profile"
              activeClassName={ACTIVE_LINK}
            >
              Profile
            </Button>

            <Button
              classes={{ root: classes.buttonRoot }}
              component={Link}
              to="/app/settings"
              activeClassName={ACTIVE_LINK}
            >
              Settings
            </Button>
          </ButtonGroup>
        </Box>

        <AppHeader>
          <Box
            pt={6}
            pb={10.5}
            display="flex"
            maxWidth={
              "min(calc(var(--geist-page-width-with-margin) - 2 * var(--geist-gap)), calc(100vw - 2 * var(--geist-gap)))"
            }
            marginLeft="auto"
            marginRight="auto"
          >
            <Box mr={2}>
              <Avatar classes={{ root: classes.avatarRoot }}></Avatar>
            </Box>
            <Box display="flex" flexDirection="column">
              <h1>{idTokenPayload?.name ?? accessTokenPayload?.username}</h1>
              <p>
                Signed in:{" "}
                {new Date(
                  accessTokenPayload?.auth_time * 1000
                ).toLocaleString()}
              </p>
            </Box>
          </Box>
        </AppHeader>

        <AppBody>
          <Box
            style={{
              transform: "translateY(var(--geist-space-small-negative))",
              marginLeft: "auto",
              marginRight: "auto",
              maxWidth:
                "min(calc(var(--geist-page-width-with-margin) - 2 * var(--geist-gap)), calc(100vw - 2 * var(--geist-gap)))",
            }}
          >
            <Router basepath="/app">
              <Profile path="/profile" data={idTokenPayload} />
              <Settings path="/settings" data={idTokenPayload} />
              <Default path="/*" />
            </Router>
          </Box>
        </AppBody>
      </LayoutManager>
    </>
  )
}

export default App
