import React, { useState, useEffect } from "react"
// https://en.wiktionary.org/wiki/%E2%A0%BC
const ICONS = ["⠇", "⠋", "⠙", "⠸", "⠴", "⠦"]
const COLORS = ["red", "orange", "goldenyellow", "green", "blue", "purple"]

/**
 * # LoadingIndicator
 */
export const LoadingIndicator = ({ style = {} }) => {
  /** state */
  const [i, setI] = useState(0)

  /** handler */
  const _handleInterval = () => {
    setI(state => (state + 1) % 6)
  }

  /** lifecycle/side effect */
  useEffect(() => {
    const interval = setInterval(_handleInterval, 50)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return <div style={{ ...style, color: COLORS[i] }}>{ICONS[i]}</div>
}
