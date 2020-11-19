import React from "react"
import type { RouteComponentProps } from "@reach/router"
import { LoadingPage } from "components/LoadingPage"

export const Default = ({ navigate }: RouteComponentProps) => {
  navigate?.("/app/profile")
  return <LoadingPage />
}
