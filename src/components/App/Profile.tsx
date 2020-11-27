import React, { useEffect } from "react"
import { useLazyQuery, useMutation, gql } from "@apollo/client"
import type { RouteComponentProps } from "@reach/router"
import Avatar from "@material-ui/core/Avatar"
import Box from "@material-ui/core/Box"
import MuiDivider from "@material-ui/core/Divider"
import Grid from "@material-ui/core/Grid"
import { useTheme, withStyles } from "@material-ui/core/styles"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import Skeleton from "@material-ui/lab/Skeleton"
import ms from "ms"

import { fs } from "components/Fieldset"
import type { IdTokenPayload } from "utils"
import type { User } from "entities"

const Divider = withStyles({
  root: {
    background: "var(--accents-2)",
  },
})(MuiDivider)

const GET_OR_CREATE_USER = gql`
  mutation GetOrCreateUser(
    $email: String!
    $firstName: String
    $lastName: String
  ) {
    getOrCreateUser(email: $email, firstName: $firstName, lastName: $lastName) {
      id
      created
      updated
      deleted
      username
      email
      first_name
      last_name
      cognito_sub
      avatar_url
    }
  }
`

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      created
      username
      first_name
      last_name
      avatar_url
    }
  }
`

export const Profile = (
  props: RouteComponentProps<{ data: IdTokenPayload | null }>
) => {
  const theme = useTheme()
  const match = useMediaQuery(theme.breakpoints.down("sm"))

  const [getOrCreateUser, { client }] = useMutation<{
    getOrCreateUser: User
  }>(GET_OR_CREATE_USER, {
    variables: {
      email: props.data?.email,
      firstName: props.data?.given_name,
      lastName: props.data?.family_name,
    },
  })
  const [getUsers, { data: getUsersData, loading, called }] = useLazyQuery<{
    getUsers: Partial<User>[]
  }>(GET_USERS)

  useEffect(() => {
    async function fetchData() {
      try {
        if (client.cache?.data?.data?.[`User:${props.data?.sub}`]) {
          return
        }
        getOrCreateUser()
      } catch (err) {
      } finally {
        getUsers()
      }
    }
    fetchData()
  }, [])

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
          {!called || loading ? (
            <>
              <Skeleton animation="wave" height={40} />
              <Skeleton animation="wave" height={40} />
              <Skeleton animation="wave" height={40} />
            </>
          ) : (
            <>
              {getUsersData?.getUsers?.map?.((user) => {
                const created = ms(+new Date() - +new Date(user.created!))
                return (
                  <div key={user.id}>
                    <Box display="flex" py="var(--geist-gap-half)">
                      <Avatar
                        src={user.avatar_url}
                        style={{
                          height: "var(--geist-space-gap)",
                          width: "var(--geist-space-gap)",
                          marginRight: "var(--geist-gap-half)",
                        }}
                      >
                        {user.first_name?.[0]}
                      </Avatar>
                      <span>
                        <b>
                          {user.username ?? (user.first_name && user.last_name)
                            ? `${user.first_name} ${user.last_name}`
                            : user.id}
                        </b>
                        &nbsp;joined&nbsp;
                        {created}
                      </span>
                    </Box>
                    <Divider />
                  </div>
                )
              })}
            </>
          )}
        </Box>
      </Grid>
    </Grid>
  )
}
