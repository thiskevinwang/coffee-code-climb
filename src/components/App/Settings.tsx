import React, { useEffect, useState } from "react"
import type { RouteComponentProps } from "@reach/router"
import { useMutation, gql } from "@apollo/client"
import Box from "@material-ui/core/Box"
import Avatar from "@material-ui/core/Avatar"
import TextField from "@material-ui/core/TextField"
import InputAdornment from "@material-ui/core/InputAdornment"
import { makeStyles, withStyles } from "@material-ui/core/styles"
import { useSnackbar } from "notistack"

import { fs } from "components/Fieldset"
import { SubmitButton } from "components/Form/SubmitButton"
import {
  Mutation,
  MutationUpdateUsernameArgs,
  Query,
  QueryGetOrCreateUserArgs,
} from "types"
import { GET_OR_CREATE_USER } from "pages/app"

const CssTextField = withStyles((theme) => ({
  root: {
    "& .MuiOutlinedInput-adornedStart": {
      // remove auto added padding when
      // 'startAdornment' is present
      paddingLeft: "0",
    },
    "& label.Mui-focused": {},
    "& .MuiInput-underline:after": {},
    "& .MuiOutlinedInput-root": {
      // hack to hide 'startAdornment' background
      // from bleeding over the rounded border
      overflow: "hidden",
      height: 40,
      // Input
      "& input": {
        color: "var(--geist-foreground)",
        "&.Mui-disabled": {
          cursor: "not-allowed",
          color: "var(--accents-3)",
        },
      },
      // Border
      "& fieldset": {
        borderColor: "var(--accents-3)",
        transition: theme.transitions.create(["border-color"], {
          easing: theme.transitions.easing.easeInOut,
        }),
      },
      "&:hover fieldset": {
        borderColor: "var(--geist-foreground)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "var(--geist-foreground)",
      },
      "&.Mui-disabled fieldset": {
        borderColor: "var(--accents-3)",
      },
    },

    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
    [theme.breakpoints.up("sm")]: {
      width: "40ch",
    },
  },
}))(TextField)

const useStyles = makeStyles((theme) => {
  return {
    inputAdornment: {
      color: "var(--accents-7)",
      // requires the TextField's 'height' to be set
      height: "100%",
      // remove 'max-height' css
      maxHeight: "unset",
      background: "var(--accents-1)",
      borderRight: "1px solid var(--accents-3)",
      padding: "0 10px",
    },
    paperRoot: {
      background: "var(--geist-background)",
      boxShadow: "var(--shadow-medium)",
      display: "flex",
      flexDirection: "column",
    },

    avatarRoot: {
      height: "var(--geist-space-24x)",
      width: "var(--geist-space-24x)",
    },
  }
})

const UPDATE_USERNAME = gql`
  mutation UpdateUsername($id: ID!, $username: String!) {
    updateUsername(id: $id, username: $username) {
      PK
      SK
      created
      updated
      identities {
        providerName
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

interface Props {
  user: Query["getOrCreateUser"]
  variablesForCacheUpdate: QueryGetOrCreateUserArgs
}

export const Settings = ({
  user,
  variablesForCacheUpdate,
}: RouteComponentProps<Props>) => {
  console.log("user", user)
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()

  const [username, setUsername] = useState(user?.preferred_username)
  const [error, setError] = useState("")

  const [updateUsername] = useMutation<
    {
      updateUsername: Mutation["updateUsername"]
    },
    MutationUpdateUsernameArgs
  >(UPDATE_USERNAME, {
    onCompleted: (res) => {
      enqueueSnackbar("Username updated", { variant: "success" })
    },
    onError: (err) => {
      setError(err.message)
      enqueueSnackbar(err.message, { variant: "error" })
    },
    update: (cache, mutationResult) => {
      const preferred_username =
        mutationResult.data?.updateUsername?.preferred_username

      // Get the cached data
      const cacheData = cache.readQuery<{ user: Query["getOrCreateUser"] }>({
        query: GET_OR_CREATE_USER,
        variables: variablesForCacheUpdate,
      })

      // Create fresh data
      const freshData = {
        user: {
          ...cacheData?.user,
          preferred_username: preferred_username,
        },
      }

      // Update the cache with fresh data
      cache.writeQuery({
        query: GET_OR_CREATE_USER,
        data: freshData,
        variables: variablesForCacheUpdate,
      })
    },
  })

  useEffect(() => {
    setUsername(user?.preferred_username)
  }, [user])

  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <>
      <fs.Fieldset>
        <fs.Content>
          <fs.Title>Your Username</fs.Title>
          <fs.Subtitle>
            This is your URL namespace within CoffeeCodeClimb.
          </fs.Subtitle>
          <CssTextField
            variant="outlined"
            error={!!error}
            helperText={error}
            placeholder={user?.cognitoUsername!}
            value={username}
            onChange={(e) => {
              setError("")
              setUsername(e.target.value)
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  classes={{ root: classes.inputAdornment }}
                  position="start"
                  disableTypography
                >
                  /u/
                </InputAdornment>
              ),
            }}
          />
        </fs.Content>
        <fs.Footer>
          <fs.Footer.Status>
            {true
              ? "Please use 48 characters at maximum."
              : "Usernames must be lowercase, begin with an alphanumeric character followed by more alphanumeric characters or dashes and ending with an alphanumeric character."}
          </fs.Footer.Status>
          <fs.Footer.Action>
            <SubmitButton
              disabled={
                isSubmitting || username === user?.preferred_username || !!error
              }
              onClick={async () => {
                setIsSubmitting(true)
                try {
                  await updateUsername({
                    variables: {
                      id: user?.cognitoUsername!,
                      username: username!, // modified by user input
                    },
                  })
                  setIsSubmitting(false)
                } catch (err) {
                  console.err(err)
                }
              }}
            >
              Save
            </SubmitButton>
          </fs.Footer.Action>
        </fs.Footer>
      </fs.Fieldset>

      <fs.Fieldset>
        <fs.Content>
          <fs.Title>Your Name</fs.Title>
          <fs.Subtitle>
            Please enter your full name, or a display name you are comfortable
            with.
          </fs.Subtitle>
          <CssTextField disabled variant="outlined" value={user?.name} />
        </fs.Content>
        <fs.Footer>
          <fs.Footer.Status>Feature in progress 🚧</fs.Footer.Status>
        </fs.Footer>
      </fs.Fieldset>

      <fs.Fieldset>
        <fs.Content>
          <fs.Title>Your Email</fs.Title>
          <fs.Subtitle>
            Please enter the email address you want to use to log in with
            CoffeeCodeClimb.
          </fs.Subtitle>
          <CssTextField disabled variant="outlined" value={user?.email} />
        </fs.Content>
        <fs.Footer>
          <fs.Footer.Status>Feature in progress 🚧</fs.Footer.Status>
        </fs.Footer>
      </fs.Fieldset>

      <fs.Fieldset>
        <fs.Content display="flex">
          <Box flex={1}>
            <h2>Your Avatar</h2>
            <p>This is your avatar.</p>
          </Box>
          <Box display="flex" alignItems="center">
            <Avatar classes={{ root: classes.avatarRoot }} />
          </Box>
        </fs.Content>
        <fs.Footer>
          <fs.Footer.Status>Feature in progress 🚧</fs.Footer.Status>
        </fs.Footer>
      </fs.Fieldset>
    </>
  )
}
