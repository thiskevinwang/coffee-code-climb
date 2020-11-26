import React from "react"
import type { RouteComponentProps } from "@reach/router"
import type { IdTokenPayload } from "utils"
import Paper from "@material-ui/core/Paper"
import Box from "@material-ui/core/Box"
import Divider from "@material-ui/core/Divider"
import Avatar from "@material-ui/core/Avatar"
import TextField from "@material-ui/core/TextField"
import InputAdornment from "@material-ui/core/InputAdornment"
import { makeStyles, withStyles } from "@material-ui/core/styles"

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
    divider: {
      background: "var(--accents-2)",
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
      <Paper
        classes={{ root: classes.paperRoot }}
        style={{
          marginBottom: "var(--geist-gap)",
        }}
      >
        <Box p={3}>
          <Box flex={1}>
            <h2>Your Username</h2>
            <p>
              This is your URL namespace within CoffeeCodeClimb.
              <br />
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
            </p>
          </Box>
        </Box>
        <Divider classes={{ root: classes.divider }} />
        <Box
          py={1.5}
          px={3}
          bgcolor="var(--accents-1)"
          color="var(--accents-6)"
          component="footer"
        >
          Put something here...
        </Box>
      </Paper>

      <Paper
        classes={{ root: classes.paperRoot }}
        style={{
          marginBottom: "var(--geist-gap)",
        }}
      >
        <Box p={3}>
          <Box flex={1}>
            <h2>Your Name</h2>
            <p>
              Please enter your full name, or a display name you are comfortable
              with.
              <br />
              <CssTextField
                disabled
                variant="outlined"
                value={props.data?.name}
              />
            </p>
          </Box>
        </Box>
        <Divider classes={{ root: classes.divider }} />
        <Box
          py={1.5}
          px={3}
          bgcolor="var(--accents-1)"
          color="var(--accents-6)"
          component="footer"
        >
          Put something here...
        </Box>
      </Paper>

      <Paper
        classes={{ root: classes.paperRoot }}
        style={{
          marginBottom: "var(--geist-gap)",
        }}
      >
        <Box p={3}>
          <Box flex={1}>
            <h2>Your Email</h2>
            <p>
              Please enter the email address you want to use to log in with
              CoffeeCodeClimb.
              <br />
              <CssTextField
                disabled
                variant="outlined"
                value={props.data?.email}
              />
            </p>
          </Box>
        </Box>
        <Divider classes={{ root: classes.divider }} />
        <Box
          py={1.5}
          px={3}
          bgcolor="var(--accents-1)"
          color="var(--accents-6)"
          component="footer"
        >
          Put something here...
        </Box>
      </Paper>

      <Paper classes={{ root: classes.paperRoot }} style={{}}>
        <Box p={3} display="flex">
          <Box flex={1}>
            <h2>Your Avatar</h2>
            <p>
              This is your avatar.
              <br />
              Upload feature coming soon! 🚧
            </p>
          </Box>
          <Box display="flex" alignItems="center">
            <Avatar classes={{ root: classes.avatarRoot }} />
          </Box>
        </Box>
        <Divider classes={{ root: classes.divider }} />
        <Box
          py={1.5}
          px={3}
          bgcolor="var(--accents-1)"
          color="var(--accents-6)"
          component="footer"
        >
          alsaldjljaslkjfas
        </Box>
      </Paper>
    </>
  )
}
