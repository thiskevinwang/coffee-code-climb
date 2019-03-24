import React from "react"
import { Link, navigate } from "gatsby"
import { getUser, isLoggedIn, logout } from "../services/auth"
import Paper from "@material-ui/core/Paper"
import { isSafari, isFirefox } from "react-device-detect"

export default () => {
  const content = { message: "", login: true }
  if (isLoggedIn()) {
    content.message = `Hello, ${getUser().name}`
  } else {
    content.message = "You are not logged in"
  }
  return (
    <Paper
      style={{
        background: "white",
        position: isSafari
          ? `-webkit-sticky`
          : isFirefox
          ? `-moz-sticky`
          : `sticky`,
        top: 15,
        left: 0,
        display: "flex",
        flex: "1",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #d1c1e0",
        height: 70,
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: 15,
        zIndex: 9999,
      }}
    >
      <span>{content.message}</span>
      <nav>
        <Link to="/">Home</Link>
        {` `}
        <Link to="/app/profile">Profile</Link>
        {` `}
        {isLoggedIn() ? (
          <a
            href="/"
            onClick={event => {
              event.preventDefault()
              logout(() => navigate(`/app/login`))
            }}
          >
            Logout
          </a>
        ) : null}
      </nav>
    </Paper>
  )
}
