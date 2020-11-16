import React from "react"
import type { RouteComponentProps } from "@reach/router"

export const Default = ({ navigate }: RouteComponentProps) => {
  navigate?.("/app/profile")
  return null
}
