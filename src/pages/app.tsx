import React, { useEffect } from "react"
import ms from "ms"
import { useLazyQuery, gql } from "@apollo/client"
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
import SEO from "components/seo"
import { Profile, Settings, Default } from "components/App"

import { useVerifyTokenSet } from "utils"
import { Query, QueryGetOrCreateUserArgs, UserInput } from "types"

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

// --geist-gap = 24px
const breakoutFromMaxWidth = css`
  /* -24px */
  --negative-gap: calc(var(--geist-gap) * -1);
  /* 48px */
  --two-gap: calc(var(--geist-gap) * 2);
  /* 1048px */
  --max: var(--geist-page-width-with-margin);

  --negative-margin: min(
    calc(calc(100vw - min(100vw, calc(var(--max) - var(--two-gap)))) / -2),
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

export const GET_OR_CREATE_USER = gql`
  query GetOrCreateUser($userInput: UserInput!) {
    user: getOrCreateUser(userInput: $userInput) {
      PK
      SK
      created
      updated
      identities {
        providerName
        dateCreated
      }
      name
      email
      family_name
      given_name
      preferred_username
      cognitoUsername
      avatar_url
    }
  }
`

const GET_USERS = gql`
  query GetUsers {
    users: getUsers {
      PK
      SK
      created
      updated
      # identities {
      #   providerName
      # }
      name
      family_name
      given_name
      preferred_username
      cognitoUsername
      avatar_url
    }
  }
`

/**
 * Anything at `/app/*` requires the user to be authenticated
 */
const App = ({ location }: PageProps) => {
  const { isLoggedIn, idTokenPayload, accessTokenPayload } = useVerifyTokenSet()
  const classes = useStyles()

  const userInput: UserInput = {
    cognitoUsername: idTokenPayload?.["cognito:username"],
    email: idTokenPayload?.email,
    email_verified: idTokenPayload?.email_verified,
    identities: idTokenPayload?.identities,
    sub: idTokenPayload?.sub,
    name: idTokenPayload?.name,
    family_name: idTokenPayload?.family_name,
    given_name: idTokenPayload?.given_name,
    preferred_username: idTokenPayload?.preferred_username,
  }

  /**
   * This is the input for the `GET_OR_CREATE_USER` query and
   * it is also passed to <Settings/> so that another mutation
   * may update the Apollo InMemoryCache
   */
  const getOrCreateUserVariables: QueryGetOrCreateUserArgs = {
    userInput,
  }

  const [getUsers, { data: usersData, loading: usersLoading }] = useLazyQuery<{
    users: Query["getUsers"]
  }>(GET_USERS)
  const users = usersData?.users

  const [
    getOrCreateUser,
    { data: userData, loading: userLoading },
  ] = useLazyQuery<{
    user: Query["getOrCreateUser"]
  }>(GET_OR_CREATE_USER, {
    variables: getOrCreateUserVariables,
    onCompleted: async (res) => {
      await getUsers()
    },
    onError: (err) => {},
  })

  const user = userData?.user

  useEffect(() => {
    if (isLoggedIn === true) getOrCreateUser()
  }, [isLoggedIn])

  if (isLoggedIn === null) {
    return <LoadingPage />
  }
  if (isLoggedIn === false) {
    navigate("/auth/login")
    return null
  }

  return (
    <>
      <SEO title="App" />
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
                Logged in:&nbsp;
                {ms(
                  +new Date() - +new Date(accessTokenPayload?.auth_time * 1000)
                )}
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
              <Profile
                path="/profile"
                user={user}
                userLoading={userLoading}
                users={users}
                usersLoading={usersLoading}
              />
              <Settings
                path="/settings"
                user={user}
                variablesForCacheUpdate={getOrCreateUserVariables}
              />
              <Default path="/*" />
            </Router>
          </Box>
        </AppBody>
      </LayoutManager>
    </>
  )
}

export default App
