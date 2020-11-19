import React from "react"
import type { RouteComponentProps } from "@reach/router"
import type { IdTokenPayload } from "utils"

export const Profile = (
  props: RouteComponentProps<{ data: IdTokenPayload | null }>
) => {
  return (
    <>
      <h2>Profile</h2>
      <p>Email: {props.data?.email}</p>
      <p>Providers: {props.data?.identities?.map((e) => e.providerName)}</p>
    </>
  )
}
