import React from "react"
import type { RouteComponentProps } from "@reach/router"
import Avatar from "@material-ui/core/Avatar"
import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import { useTheme } from "@material-ui/core/styles"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import Skeleton from "@material-ui/lab/Skeleton"
import ms from "ms"

import { fs, Divider } from "components/Fieldset"
import { Query } from "types"

/**
 * Generates n-number of skeletons
 */
function generateUserSkeletons(n: number) {
  return (
    <>
      {Array(n)
        .fill(null)
        .map((_, i) => (
          <React.Fragment key={i}>
            <Box display="flex" py="var(--geist-gap-half)" alignItems="center">
              <Skeleton
                component="div"
                variant="circle"
                animation="wave"
                style={{
                  height: "var(--geist-space-gap)",
                  width: "var(--geist-space-gap)",
                  marginRight: "var(--geist-gap-half)",
                }}
              />

              <Skeleton
                component="div"
                animation="wave"
                style={{ display: "flex", flex: 1 }}
              />
            </Box>
            <Divider />
          </React.Fragment>
        ))}
    </>
  )
}
interface Props {
  user: Query["getOrCreateUser"]
  userLoading: boolean
  users: Query["getUsers"]
  usersLoading: boolean
}
export const Profile = ({
  user,
  userLoading,
  users,
  usersLoading,
}: RouteComponentProps<Props>) => {
  const theme = useTheme()
  const match = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <Grid container>
      <Grid item md={7} sm={12} xs={12}>
        <fs.Fieldset>
          <fs.Content>
            <fs.Title>Profile</fs.Title>
            <fs.Subtitle>
              {userLoading ? (
                <>
                  <Skeleton animation="wave" />
                </>
              ) : (
                <>
                  {user?.identities?.map((e, i) => {
                    const created = ms(+new Date() - parseInt(e.dateCreated!))
                    return (
                      <Box
                        key={`${e.userId}${i}`}
                        display="flex"
                        flexDirection="row"
                      >
                        <div>
                          <b>{e.providerName!}</b>&nbsp;
                          <small>Linked&nbsp;{created}</small>
                        </div>
                      </Box>
                    )
                  })}
                </>
              )}
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

          {usersLoading
            ? generateUserSkeletons(3)
            : users?.map?.((user) => {
                const created = ms(+new Date() - +new Date(user?.created!))
                const firstInitial = (user?.preferred_username ??
                  user?.given_name)?.[0]
                const displayName =
                  user?.preferred_username ||
                  (user?.given_name && user?.family_name
                    ? `${user?.given_name} ${user?.family_name}`
                    : user?.id)
                return (
                  <div key={user?.PK}>
                    <Box
                      display="flex"
                      py="var(--geist-gap-half)"
                      alignItems="center"
                    >
                      <Avatar
                        src={user?.avatar_url}
                        style={{
                          height: "var(--geist-space-gap)",
                          width: "var(--geist-space-gap)",
                          marginRight: "var(--geist-gap-half)",
                          border: "1px solid var(--accents-2)",
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
