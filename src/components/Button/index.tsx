import React from "react"
import styled from "styled-components"
import { animated, useSpring, config } from "react-spring"
import { useGesture } from "react-use-gesture"

import { rhythm } from "utils/typography"

const FROM_STYLE = {
  transform: `scale(1)`,
}

const MOUSEOVER_STYLE = {
  transform: `scale(1.1)`,
}

const MOUSEDOWN_STYLE = {
  transform: `scale(0.98)`,
}
interface Props {
  isDarkMode: boolean
  textSm: boolean
  widthRem?: number
}

const Renderer = styled(animated.button)`
  background: var(--background);
  color: var(--text);

  border-radius: 5px;
  border-style: solid;
  border-width: 0;
  box-shadow: var(--shadow);

  font-size: ${(props) => props.textSm && `12px`};
  font-weight: lighter;

  line-height: 1.2;
  display: inline-block;
  text-align: center;
  padding: ${rhythm(0.5)};

  margin-right: 10px;
  margin-bottom: 10px;

  > label {
    background: var(--background);
    padding: 5px 10px;
    margin-left: 5px;
  }
`

/**
 * # Button
 * A *not-too-shabbily* styled button
 *
 * @param {Props} props
 *
 * @usage
 *
 * ```jsx
 * <Button>
 *   <span>we need span here for global style update</span>
 * </Button>
 * ```
 */
export const Button = (props: Props) => {
  const [springProps, set] = useSpring(() => ({
    from: { ...FROM_STYLE },
    config: config.stiff,
  }))
  const bind = useGesture({
    onHover: ({ hovering }) => {
      set(hovering ? MOUSEOVER_STYLE : FROM_STYLE)
    },
    onDrag: ({ down, hovering }) => {
      set(down ? MOUSEDOWN_STYLE : hovering ? MOUSEOVER_STYLE : FROM_STYLE)
    },
  })

  return (
    <Renderer
      {...props}
      style={{ ...springProps, width: `${props.widthRem}rem` }}
      {...bind()}
    />
  )
}
