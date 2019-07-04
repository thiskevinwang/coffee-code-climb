import React from "react"
import { Link } from "gatsby"
import Paper from "@material-ui/core/Paper"
import { isMobile } from "react-device-detect"
import { rhythm } from "src/utils/typography"
import { Hello } from "./Hello"

export default function NavBar({ location, opacity }) {
  const rootPath: string = `${__PATH_PREFIX__}/`

  return (
    <Paper
      className={"navbar"}
      style={{
        alignItems: "center",
        background: "white",
        display: "flex",
        flex: "1",
        height: 70,
        justifyContent: "space-between",
        left: 0,
        marginBottom: `${rhythm(1)}`,
        marginLeft: isMobile ? `${rhythm(1)}` : `auto`,
        marginRight: isMobile ? `${rhythm(1)}` : `auto`,
        maxWidth: rhythm(24),
        opacity: opacity,
        padding: `0 ${rhythm(3 / 4)}`,
        // position: `${(() => {
        //   switch (true) {
        //     case isMobile:
        //       return `sticky`
        //     case isSafari:
        //       return `-webkit-sticky`
        //     case isFirefox:
        //       return `-moz-sticky`
        //     default:
        //       return `sticky`
        //   }
        // })()}`,
        top: `${rhythm(1)}`,
        zIndex: 9999,
      }}
    >
      <style jsx>{`
        .navbar {
          position: -webkit-sticky;
          position: sticky;
        }
      `}</style>

      <small>
        <Hello page={location.pathname} date={new Date()} />
      </small>

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
          </>
        )}
      </small>
    </Paper>
  )
}
