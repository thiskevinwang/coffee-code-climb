import React, { useEffect, useState } from "react"
import type { RouteComponentProps } from "@reach/router"
import { useMutation, gql } from "@apollo/client"
import Box from "@material-ui/core/Box"
import InputAdornment from "@material-ui/core/InputAdornment"
import { makeStyles, withStyles } from "@material-ui/core/styles"
import { useSnackbar } from "notistack"

import { fs } from "components/Fieldset"
import { SubmitButton } from "components/Form/SubmitButton"
import { AvatarCropper } from "components/AvatarCropper"
import { TextField } from "./Shared/TextField"

import {
  Mutation,
  MutationUpdateUsernameArgs,
  Query,
  QueryGetOrCreateUserArgs,
} from "types"

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
      cursor: "pointer",
    },
  }
})

const UPDATE_USERNAME = gql`
  mutation UpdateUsername($id: ID!, $username: String!) {
    updateUsername(id: $id, username: $username) {
      id
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

      cache.writeFragment({
        id: `User:${mutationResult.data?.updateUsername?.id}`,
        fragment: gql`
          fragment UserPreferredUsername on User {
            preferred_username
          }
        `,
        data: {
          preferred_username,
        },
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
          <TextField
            variant="outlined"
            error={!!error}
            helperText={error}
            placeholder={user?.id!}
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
                      id: user?.id!,
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
          <TextField disabled variant="outlined" value={user?.name} />
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
          <TextField disabled variant="outlined" value={user?.email} />
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
            <p>Click on the avatar to upload a custom one from your files.</p>
          </Box>
          <Box display="flex" alignItems="center">
            <AvatarCropper
              src={user?.avatar_url}
              variablesForCacheUpdate={variablesForCacheUpdate}
            />
          </Box>
        </fs.Content>
        <fs.Footer>
          <fs.Footer.Status>
            An avatar is optional but strongly recommended.
          </fs.Footer.Status>
        </fs.Footer>
      </fs.Fieldset>
    </>
  )
}
