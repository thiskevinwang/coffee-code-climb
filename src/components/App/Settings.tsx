import React from "react"
import type { RouteComponentProps } from "@reach/router"
import type { IdTokenPayload } from "utils"
import Paper from "@material-ui/core/Paper"
import Box, { BoxProps } from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import MuiDivider from "@material-ui/core/Divider"
import Avatar from "@material-ui/core/Avatar"
import TextField from "@material-ui/core/TextField"
import InputAdornment from "@material-ui/core/InputAdornment"
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles"
import useMediaQuery from "@material-ui/core/useMediaQuery"

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

const Divider = withStyles({
  root: {
    background: "var(--accents-2)",
  },
})(MuiDivider)

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

      <FieldSet />
    </>
  )
}

const FieldSetContainer = withStyles({
  root: {
    background: "var(--geist-background)",
    boxShadow: "var(--shadow-medium)",
    display: "flex",
    flexDirection: "column",
    marginBottom: "var(--geist-gap)",
    overflow: "hidden",
  },
})(Paper)

const Status: React.FC = ({ children }) => {
  const theme = useTheme()
  const smUp = useMediaQuery(theme.breakpoints.up("sm"))
  return (
    <Grid
      item
      xs={12}
      sm={"auto"}
      style={{ marginBottom: !smUp ? "var(--geist-gap-half)" : "0" }}
    >
      <Grid container justify={smUp ? "flex-start" : "center"}>
        {children}
      </Grid>
    </Grid>
  )
}
const Action: React.FC = ({ children }) => {
  const theme = useTheme()
  const smUp = useMediaQuery(theme.breakpoints.up("sm"))
  return (
    <Grid item xs={12} sm>
      <Grid container justify={smUp ? "flex-end" : "center"}>
        {children}
      </Grid>
    </Grid>
  )
}
interface IFooter extends React.FC {
  Status: typeof Status
  Action: typeof Action
}
const Footer: IFooter = function ({ children }) {
  const theme = useTheme()
  const smUp = useMediaQuery(theme.breakpoints.up("sm"))
  return (
    <>
      <Divider />

      <Box
        py={smUp ? "var(--geist-gap-half)" : "var(--geist-gap)"}
        px={"var(--geist-gap)"}
        bgcolor="var(--accents-1)"
        color="var(--accents-6)"
        component="footer"
      >
        <Grid container spacing={0}>
          {children}
        </Grid>
      </Box>
    </>
  )
}
Footer.Status = Status
Footer.Action = Action

interface Fs {
  Fieldset: React.FC
  Content: React.ComponentType<BoxProps>
  Title: React.FC
  Subtitle: React.FC
  Footer: typeof Footer
}

const fs: Fs = {
  Fieldset: (props) => <FieldSetContainer {...props} />,
  Content: (props) => <Box p={3} {...props} />,
  Title: (props) => <h2 {...props} />,
  Subtitle: (props) => <p {...props} />,
  Footer: Footer,
}

/** @see https://vercel.com/design/fieldset#default */
const FieldSet = () => {
  return (
    <fs.Fieldset>
      <fs.Content>
        <fs.Title>fs.Title</fs.Title>
        <fs.Subtitle>fs.Subtitle</fs.Subtitle>
      </fs.Content>
      <fs.Footer>
        <fs.Footer.Status>fs.Footer.Status</fs.Footer.Status>
        <fs.Footer.Action>
          <button>fs.Footer.Action</button>
        </fs.Footer.Action>
      </fs.Footer>
    </fs.Fieldset>
  )
}
