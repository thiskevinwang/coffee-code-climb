import React from "react"
import type { RouteComponentProps } from "@reach/router"
import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import { useTheme } from "@material-ui/core/styles"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import ms from "ms"

import { fs } from "components/Fieldset"

import type { IdTokenPayload } from "utils"

export const Profile = (
  props: RouteComponentProps<{ data: IdTokenPayload | null }>
) => {
  const theme = useTheme()
  const smDown = useMediaQuery(theme.breakpoints.down("sm"))
  return (
    <Grid container>
      <Grid item md={7} sm={12} xs={12}>
        <fs.Fieldset>
          <fs.Content>
            <fs.Title>Profile</fs.Title>
            <fs.Subtitle>
              {props.data?.identities?.map((e, i) => {
                const created = ms(+new Date() - parseInt(e.dateCreated))
                return (
                  <Box
                    key={`${e.userId}${i}`}
                    display="flex"
                    flexDirection="row"
                  >
                    <p>
                      {e.providerName}&nbsp;Linked&nbsp;{created}&nbsp;ago
                    </p>
                  </Box>
                )
              })}
            </fs.Subtitle>
          </fs.Content>
          <fs.Footer>
            <fs.Footer.Status>Feature in progress 🚧</fs.Footer.Status>
          </fs.Footer>
        </fs.Fieldset>
      </Grid>
      <Grid
        container
        item
        sm={12}
        md
        xs
        justify={smDown ? "center" : "flex-start"}
      >
        <Box px="var(--geist-gap)">
          <h2>Recent Activity</h2>
        </Box>
      </Grid>
    </Grid>
  )
}
