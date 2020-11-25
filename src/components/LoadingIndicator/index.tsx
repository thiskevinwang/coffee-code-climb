import React, { useReducer, useEffect, FC, CSSProperties } from "react"
import styled, { BaseProps } from "styled-components"
import theme from "styled-theming"
import { useTransition, animated, config } from "react-spring"

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
  cursor: wait;
`

/**
 * # LoadingIndicator
 */
export const LoadingIndicator: FC<Props> = ({ style = {} }) => {
  const [i, spin] = useReducer((s) => (s + 1) % 6, 0)
  useEffect(() => {
    const interval = setInterval(spin, 75)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const transitions = useTransition(ICONS[i], (item) => item, {
    from: {
      position: "absolute",
      transform: "translate(-50%,-50%)",
      opacity: 0,
    },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { ...config.stiff, velocity: 10 },
  })

  return (
    <Spinner style={{ ...style }} interval={i}>
      {transitions.map(({ item, props, key }) => (
        <animated.div key={key} style={props}>
          {item}
        </animated.div>
      ))}
    </Spinner>
  )
}
