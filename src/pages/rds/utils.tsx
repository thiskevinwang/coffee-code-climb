import React, { useState, useEffect } from "react"
// https://en.wiktionary.org/wiki/%E2%A0%BC
const ICONS = ["⠇", "⠋", "⠙", "⠸", "⠴", "⠦"]
const COLORS = ["red", "orange", "goldenyellow", "green", "blue", "purple"]

/**
 * # LoadingIndicator
 */
export const LoadingIndicator = () => {
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

  return <div style={{ fontSize: 35, color: COLORS[i] }}>{ICONS[i]}</div>
}

export const switchVariant = (variant: string) => {
  switch (variant) {
    case "Like":
      return "👍"
    case "Love":
      return "😍"
    case "Haha":
      return "🤣"
    case "Wow":
      return "😮"
    case "Sad":
      return "😢"
    case "Angry":
      return "😠"
    case "None":
      return ""
    default:
      return "..."
  }
}
