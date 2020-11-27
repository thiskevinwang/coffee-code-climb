import React from "react"
import type { RouteComponentProps } from "@reach/router"
import type { IdTokenPayload } from "utils"
import Box from "@material-ui/core/Box"
import Avatar from "@material-ui/core/Avatar"
import TextField from "@material-ui/core/TextField"
import InputAdornment from "@material-ui/core/InputAdornment"
import { makeStyles, withStyles } from "@material-ui/core/styles"

import { fs } from "components/Fieldset"

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

export const Settings = (
  props: RouteComponentProps<{ data: IdTokenPayload | null }>
) => {
  const classes = useStyles()
  return (
    <>
      <fs.Fieldset>
        <fs.Content>
          <fs.Title>Your Username</fs.Title>
          <fs.Subtitle>
            This is your URL namespace within CoffeeCodeClimb.
          </fs.Subtitle>
          <CssTextField
            disabled
            variant="outlined"
            value={props.data?.sub}
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
          <fs.Footer.Status>Feature in progress 🚧</fs.Footer.Status>
        </fs.Footer>
      </fs.Fieldset>

      <fs.Fieldset>
        <fs.Content>
          <fs.Title>Your Name</fs.Title>
          <fs.Subtitle>
            Please enter your full name, or a display name you are comfortable
            with.
          </fs.Subtitle>
          <CssTextField disabled variant="outlined" value={props.data?.name} />
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
          <CssTextField disabled variant="outlined" value={props.data?.email} />
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
