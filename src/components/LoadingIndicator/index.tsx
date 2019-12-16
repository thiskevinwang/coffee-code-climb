import React, { useReducer, useEffect } from "react"
// https://en.wiktionary.org/wiki/%E2%A0%BC
const ICONS = ["⠇", "⠋", "⠙", "⠸", "⠴", "⠦"]
const COLORS = ["red", "orange", "goldenyellow", "green", "blue", "purple"]

/**
 * # LoadingIndicator
 */
export const LoadingIndicator = ({ style = {} }) => {
  const [i, spin] = useReducer(s => (s + 1) % 6, 0)
  useEffect(() => {
    const interval = setInterval(spin, 50)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const [showMessage, setShowMessageTrue] = useReducer(s => true, false)
  useEffect(() => {
    const timeout = setTimeout(setShowMessageTrue, 2000)
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  const reloadPage = e => {
    window?.location.reload(true)
  }

  const linkProps = {
    href: "#",
    onClick: reloadPage,
  }

  return (
    <>
      <div style={{ ...style, color: COLORS[i] }}>{ICONS[i]}</div>
      {showMessage && (
        <p>
          Sorry, this is taking a while to load...{" "}
          <a {...linkProps}>Reload the page</a>
        </p>
      )}
    </>
  )
}
