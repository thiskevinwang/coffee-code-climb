import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert"

const useStyles = makeStyles((theme) => ({
  alert: {
    boxShadow: "var(--shadow-medium)",
    // "& > * + * > a": {
    //   color: "var(--accents-8)",
    // },

    /* filled */
    "&.MuiAlert-filledInfo": {
      background: "var(--geist-success)",
    },
    "&.MuiAlert-filledSuccess": {
      background: "var(--wv-green)",
    },
    "&.MuiAlert-filledWarning": {
      background: "var(--geist-warning)",
    },
    "&.MuiAlert-filledError": {
      background: "var(--geist-error)",
    },

    /* outlined */
    "&.MuiAlert-outlinedInfo": {
      border: "1px solid var(--geist-success)",
      color: "var(--geist-success)",
      "& .MuiAlert-icon": {
        color: "var(--geist-success)",
      },
    },
    "&.MuiAlert-outlinedSuccess": {
      border: "1px solid var(--wv-green)",
      color: "var(--wv-green)",
      "& .MuiAlert-icon": {
        color: "var(--wv-green)",
      },
    },
    "&.MuiAlert-outlinedWarning": {
      border: "1px solid var(--geist-warning)",
      color: "var(--geist-warning)",
      "& .MuiAlert-icon": {
        color: "var(--geist-warning)",
      },
    },
    "&.MuiAlert-outlinedError": {
      border: "1px solid var(--geist-error)",
      color: "var(--geist-error)",
      "& .MuiAlert-icon": {
        color: "var(--geist-error)",
      },
    },

    /* standard */
    "&.MuiAlert-standardInfo": {
      backgroundColor: "var(--geist-success-lighter)",
      color: "var(--geist-success-dark)",
      "& .MuiAlert-icon": {
        color: "var(--geist-success-dark)",
      },
    },
    "&.MuiAlert-standardSuccess": {
      backgroundColor: "var(--geist-success-lighter)",
      color: "var(--geist-success-dark)",
      "& .MuiAlert-icon": {
        color: "var(--geist-success-dark)",
      },
    },
    "&.MuiAlert-standardWarning": {
      backgroundColor: "var(--geist-warning-lighter)",
      color: "var(--geist-warning-dark)",
      "& .MuiAlert-icon": {
        color: "var(--geist-warning-dark)",
      },
    },
    "&.MuiAlert-standardError": {
      backgroundColor: "var(--geist-error-lighter)",
      color: "var(--geist-error-dark)",
      "& .MuiAlert-icon": {
        color: "var(--geist-error-dark)",
      },
      "& > .MuiAlert-message > a:hover": {
        color: "black",
      },
    },
  },
}))

export const Alert: React.ComponentType<AlertProps> = (props) => {
  const classes = useStyles()
  return (
    <MuiAlert
      variant="standard"
      severity="info"
      classes={{ root: classes.alert }}
      {...props}
    />
  )
}
