import React from "react"
import MuiDivider from "@material-ui/core/Divider"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import Box, { BoxProps } from "@material-ui/core/Box"
import { useTheme, withStyles } from "@material-ui/core/styles"
import useMediaQuery from "@material-ui/core/useMediaQuery"

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

const Divider = withStyles({
  root: {
    background: "var(--accents-2)",
  },
})(MuiDivider)

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

/**
 * # fs
 * ```
 * ├── FieldSet
 * ├── Content
 * ├── Title
 * ├── Subtitle
 * └── Footer
 *     ├── Status
 *     └── Action
 * ```
 *
 * @example
 * ```tsx
 * <fs.Fieldset>
 *   <fs.Content>
 *     <fs.Title>fs.Title</fs.Title>
 *     <fs.Subtitle>fs.Subtitle</fs.Subtitle>
 *   </fs.Content>
 *   <fs.Footer>
 *     <fs.Footer.Status>fs.Footer.Status</fs.Footer.Status>
 *     <fs.Footer.Action>
 *       <button>fs.Footer.Action</button>
 *     </fs.Footer.Action>
 *   </fs.Footer>
 * </fs.Fieldset>
 * ```
 */
export const fs: Fs = {
  Fieldset: (props) => <FieldSetContainer {...props} />,
  Content: (props) => <Box p={3} {...props} />,
  Title: (props) => <h2 {...props} />,
  Subtitle: (props) => <p {...props} />,
  Footer: Footer,
}

// sample
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
