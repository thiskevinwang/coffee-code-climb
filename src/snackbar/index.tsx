import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { SnackbarProvider as Provider } from "notistack"

/**
 * @TODO Remove !important
 */
const useStyles = makeStyles((theme) => ({
  success: { backgroundColor: "var(--geist-success) !important" },
  error: { backgroundColor: "var(--geist-error) !important" },
  warning: { backgroundColor: "var(--geist-warning) !important" },
  info: { backgroundColor: "var(--geist-success) !important" },
}))

export const SnackbarProvider: React.ComponentType = ({ children }) => {
  const classes = useStyles()
  return (
    <Provider
      maxSnack={3}
      classes={{
        variantSuccess: classes.success,
        variantError: classes.error,
        variantWarning: classes.warning,
        variantInfo: classes.info,
      }}
    >
      {children}
    </Provider>
  )
}
