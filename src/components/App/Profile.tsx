import React from "react"
import type { RouteComponentProps } from "@reach/router"
import type { IdTokenPayload } from "utils"
import Box from "@material-ui/core/Box"

export const Profile = (
  props: RouteComponentProps<{ data: IdTokenPayload | null }>
) => {
  return (
    <>
      <h2>Profile</h2>
      <p>
        Email: <span>{props.data?.email}</span>
      </p>
      <h3>Linked Identities</h3>
      {props.data?.identities?.map((e, i) => {
        const created = new Date(parseInt(e.dateCreated))
        return (
          <Box key={`${e.userId}${i}`} display="flex" flexDirection="row">
            <Box mr={2}>
              <p>{e.providerName}</p>
            </Box>
            <Box>
              <p>
                Linked&nbsp;
                <code>
                  {created.toLocaleDateString()}, {created.toLocaleTimeString()}
                </code>
              </p>
            </Box>
          </Box>
        )
      })}
    </>
  )
}
