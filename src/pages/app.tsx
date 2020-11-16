import React from "react"
import { navigate, PageProps } from "gatsby"
import { Router } from "@reach/router"
import { LayoutManager } from "components/layoutManager"

import { Profile, Settings, Default } from "components/App"

import { useVerifyTokenSet } from "utils"

/**
 * Anything at `/app/*` requires the user to be authenticated
 */
const App = ({ location }: PageProps) => {
  const { isLoggedIn, decoded } = useVerifyTokenSet()

  if (isLoggedIn === null) {
    return (
      <LayoutManager location={location}>
        <h1>...</h1>
      </LayoutManager>
    )
  }
  if (isLoggedIn === false) {
    navigate("/auth/login")
    return null
  }
  return (
    <LayoutManager location={location}>
      <h1>App</h1>

      <pre>{JSON.stringify(location.state, null, 2)}</pre>

      <Router basepath="/app">
        <Profile path="/profile" data={decoded} />
        <Settings path="/settings" />
        <Default path="/*" />
      </Router>
    </LayoutManager>
  )
}
export default App
