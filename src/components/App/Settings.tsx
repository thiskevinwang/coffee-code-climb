import React from "react"
import type { RouteComponentProps } from "@reach/router"

export const Settings = (props: RouteComponentProps) => {
  return (
    <>
      <h2>Settings</h2>
      <pre>{JSON.stringify(props.data, null, 2)}</pre>
    </>
  )
}
