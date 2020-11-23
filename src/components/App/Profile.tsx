import React from "react"
import type { RouteComponentProps } from "@reach/router"
import type { IdTokenPayload } from "utils"

export const Profile = (
  props: RouteComponentProps<{ data: IdTokenPayload | null }>
) => {
  return (
    <>
      <h2>Profile</h2>
      <p>
        Email: <span style={{ filter: "blur(4px)" }}>{props.data?.email}</span>
      </p>
    </>
  )
}
