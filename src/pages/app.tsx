import React from "react"
import { navigate } from "gatsby"
import { Router } from "@reach/router"
import { LayoutManager } from "components/layoutManager"
import { useVerifyTokenSet } from "utils"

const App = ({ location }: { location: Location }) => {
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
      <pre>{JSON.stringify(decoded, null, 2)}</pre>
      <Router></Router>
    </LayoutManager>
  )
}
export default App
