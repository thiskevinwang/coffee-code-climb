import React from "react"
import { navigate, PageProps, Link } from "gatsby"
import { Router } from "@reach/router"
import { LayoutManager } from "components/layoutManager"
import { LoadingPage } from "components/LoadingPage"

import { Profile, Settings, Default } from "components/App"

import { useVerifyTokenSet } from "utils"

/**
 * Anything at `/app/*` requires the user to be authenticated
 */
const App = ({ location }: PageProps) => {
  const { isLoggedIn, decoded, decodedAcc } = useVerifyTokenSet()

  if (isLoggedIn === null) {
    return <LoadingPage />
  }
  if (isLoggedIn === false) {
    navigate("/auth/login")
    return null
  }
  return (
    <LayoutManager location={location}>
      <h1>App</h1>
      <Link to="/app/profile">Profile</Link>&nbsp;
      <Link to="/app/settings">Settings</Link>
      {/* <h4>Location State</h4>
      <pre>{JSON.stringify(location.state, null, 2)}</pre> */}
      <h2>Username</h2>
      <p>{decodedAcc?.username}</p>
      {/* <pre>{JSON.stringify(decodedAcc, null, 2)}</pre> */}
      <Router basepath="/app">
        <Profile path="/profile" data={decoded} />
        <Settings path="/settings" />
        <Default path="/*" />
      </Router>
    </LayoutManager>
  )
}

export default App
