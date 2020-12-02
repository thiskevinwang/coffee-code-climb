import React from "react"
import type { RouteComponentProps } from "@reach/router"
import Avatar from "@material-ui/core/Avatar"
import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import { useTheme } from "@material-ui/core/styles"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import ms from "ms"

import { fs, Divider } from "components/Fieldset"
import { Query } from "types"

interface Props {
  user: Query["getOrCreateUser"]
  users: Query["getUsers"]
}
export const Profile = (props: RouteComponentProps<Props>) => {
  const theme = useTheme()
  const match = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <Grid container>
      <Grid item md={7} sm={12} xs={12}>
        <fs.Fieldset>
          <fs.Content>
            <fs.Title>Profile</fs.Title>
            <fs.Subtitle>
              {props.user?.identities?.map((e, i) => {
                const created = ms(+new Date() - parseInt(e.dateCreated!))
                return (
                  <Box
                    key={`${e.userId}${i}`}
                    display="flex"
                    flexDirection="row"
                  >
                    <p>
                      {e.providerName!}&nbsp;Linked&nbsp;{created}&nbsp;ago
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
        md={5}
        sm={12}
        xs={12}
        justify={match ? "center" : "flex-start"}
      >
        <Box
          px="var(--geist-gap)"
          ml={match ? 0 : "var(--geist-gap)"}
          width="100%"
        >
          <Box pb="var(--geist-gap)">
            <h2 style={{ textAlign: match ? "center" : "inherit" }}>
              Community
            </h2>
          </Box>

          {props.users?.map?.((user) => {
            const created = ms(+new Date() - +new Date(user?.created!))
            const firstInitial = (user?.preferred_username ??
              user?.given_name)?.[0]
            const displayName =
              user?.preferred_username ||
              (user?.given_name && user?.family_name
                ? `${user?.given_name} ${user?.family_name}`
                : user?.cognitoUsername)
            return (
              <div key={user?.PK}>
                <Box display="flex" py="var(--geist-gap-half)">
                  <Avatar
                    src={user?.avatar_url}
                    style={{
                      height: "var(--geist-space-gap)",
                      width: "var(--geist-space-gap)",
                      marginRight: "var(--geist-gap-half)",
                    }}
                  >
                    {firstInitial}
                  </Avatar>
                  <span>
                    <b>{displayName}</b>
                    &nbsp;joined&nbsp;
                    {created}
                  </span>
                </Box>
                <Divider />
              </div>
            )
          })}
        </Box>
      </Grid>
    </Grid>
  )
}
