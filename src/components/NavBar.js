import React, { useState } from "react"
import { Link } from "gatsby"
// import { getUser, isLoggedIn, logout } from "../services/auth"
// import auth from "../utils/auth"
import Paper from "@material-ui/core/Paper"
import { isSafari, isFirefox, isMobile } from "react-device-detect"
import { rhythm } from "../utils/typography"
import Avatar from "@material-ui/core/Avatar"
import { Hello } from "./tsComponent.tsx"

export default function NavBar({ location }) {
  const rootPath: string = `${__PATH_PREFIX__}/`
  const [authenticated, setAuthenticated] = useState(false)

  // function login() {
  //   auth.login()
  //   setAuthenticated(auth.isAuthenticated())
  // }

  // function logout() {
  //   auth.logout()
  //   setAuthenticated(auth.isAuthenticated())
  // }

  return (
    <Paper
      style={{
        background: "white",
        position: `${(() => {
          switch (true) {
            case isMobile:
              return `sticky`
            case isSafari:
              return `-webkit-sticky`
            case isFirefox:
              return `-moz-sticky`
            default:
              return `sticky`
          }
        })()}`,
        top: `${rhythm(1)}`,
        left: 0,
        display: "flex",
        flex: "1",
        justifyContent: "space-between",
        alignItems: "center",
        height: 70,
        padding: `0 ${rhythm(3 / 4)}`,
        marginBottom: `${rhythm(1)}`,
        zIndex: 9999,
      }}
    >
      {authenticated ? (
        <>
          <Avatar sizes={"large"} alt={"TODO"} src={"TODO"} />
          {/* {auth.getUserName() && <small>{auth.getUserName()}</small>} */}
        </>
      ) : (
        <small>
          <Hello />
          {location.pathname !== rootPath ? "😊" : "NavBar, coming soon! 👷‍♀️🚛"}
        </small>
      )}
      <small>
        {location.pathname !== rootPath && (
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
        {authenticated && location.pathname !== "/app/profile" && (
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
              onClick={null}
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
              onClick={null}
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
