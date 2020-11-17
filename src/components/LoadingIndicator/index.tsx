import React, { useReducer, useEffect, FC, CSSProperties } from "react"
import styled, { BaseProps } from "styled-components"
import theme from "styled-theming"

// https://en.wiktionary.org/wiki/%E2%A0%BC
const ICONS = ["⠇", "⠋", "⠙", "⠸", "⠴", "⠦"]
const COLORS_LIGHT = [
  "#ee0000",
  "#f5a623",
  "#50e3c2",
  "#0070f3",
  "#7928ca",
  "#f81ce5",
]
const COLORS_DARK = [
  "#ff1a1a",
  "#f7b955",
  "#79ffe1",
  "#3291ff",
  "#8a63d2",
  "#ff0080",
]

interface Props {
  style?: CSSProperties
}

const Spinner = styled.div<Props & { interval: number }>`
  color: ${(p) =>
    theme("mode", {
      light: COLORS_LIGHT[p.interval],
      dark: COLORS_DARK[p.interval],
    })};
  text-shadow: var(--shadow);
`

/**
 * # LoadingIndicator
 */
export const LoadingIndicator: FC<Props> = ({ style = {} }) => {
  const [i, spin] = useReducer((s) => (s + 1) % 6, 0)
  useEffect(() => {
    const interval = setInterval(spin, 50)
    return () => {
      clearInterval(interval)
    }
  }, [])
  return (
    <Spinner style={{ ...style }} interval={i}>
      {ICONS[i]}
    </Spinner>
  )
}
