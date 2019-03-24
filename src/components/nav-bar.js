import React, { useState, useEffect } from "react"
import { Link, navigate } from "gatsby"
// import { getUser, isLoggedIn, logout } from "../services/auth"
import auth from "../utils/auth"
import Paper from "@material-ui/core/Paper"
import { isSafari, isFirefox, isMobile } from "react-device-detect"
import { rhythm, scale } from "../utils/typography"
import Avatar from "@material-ui/core/Avatar"

export default function NavBar({ location }) {
  const rootPath: string = `${__PATH_PREFIX__}/`
  const [authenticated, setAuthenticated] = useState(auth.isAuthenticated())

  function login() {
    auth.login()
    setAuthenticated(auth.isAuthenticated())
  }

  function logout() {
    auth.logout()
    setAuthenticated(auth.isAuthenticated())
  }

  return (
    <Paper
      style={{
        background: "white",
        position: isMobile
          ? `sticky`
          : isSafari
          ? `-webkit-sticky`
          : isFirefox
          ? `-moz-sticky`
          : `sticky`,
        top: `${rhythm(1)}`,
        left: 0,
        display: "flex",
        flex: "1",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #d1c1e0",
        height: 70,
        padding: `0 ${rhythm(3 / 4)}`,
        marginBottom: `${rhythm(1)}`,
        zIndex: 9999,
      }}
    >
      {authenticated ? (
        <>
          <Avatar
            sizes={"large"}
            alt={auth.getUserName()}
            src={auth.getUser().picture}
          />
          {auth.getUserName() && <small>{auth.getUserName()}</small>}
        </>
      ) : (
        <small>{location.pathname != rootPath ? "😊" : "👋"}</small>
      )}
      <small>
        {location.pathname != rootPath && (
          <>
            <Link
              to="/"
              style={{
                boxShadow: "none",
                lineHeight: "37px",
              }}
            >
              Home
            </Link>
            {" | "}
          </>
        )}
        {authenticated && location.pathname != "/app/profile" && (
          <>
            <Link
              to="/app/profile"
              style={{
                boxShadow: "none",
                lineHeight: "37px",
              }}
            >
              Profile
            </Link>{" "}
            |{" "}
          </>
        )}
        {/* {isLoggedIn() ? (
          <a
            href="/"
            onClick={event => {
              event.preventDefault()
              logout(() => navigate(`/app/login`))
            }}
          >
            Logout
          </a>
        ) : null} */}
        {!authenticated && (
          <span>
            <a
              href="#"
              onClick={login}
              style={{
                boxShadow: "none",
                lineHeight: "37px",
              }}
            >
              Log In
            </a>
          </span>
        )}
        {authenticated && (
          <span>
            <a
              href="#"
              onClick={logout}
              style={{
                boxShadow: "none",
                lineHeight: "37px",
              }}
            >
              Log Out
            </a>
            {/* <span> | </span> */}
            {/* <Subscribe auth={auth} /> */}
          </span>
        )}
      </small>
    </Paper>
  )
}
