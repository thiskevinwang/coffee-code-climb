import React from "react"
import styled, { css } from "styled-components"
import { animated, useSpring } from "react-spring"
import { useGesture } from "react-use-gesture"

import { rhythm, scale } from "utils/typography"
import * as Colors from "consts/Colors"

/**
 * # FROM_STYLE
 * - starting animated-style
 */
const FROM_STYLE = {
  boxShadow: `0px 15px 30px -15px ${Colors.blackDark}`,
  transform: `scale(1)`,
}
/**
 * # MOUSEOVER_STYLE
 * - target animated-style
 */
const MOUSEOVER_STYLE = {
  boxShadow: `0px 17px 40px -13px ${Colors.blackDarker}`,
  transform: `scale(1.01)`,
}
/**
 * # MOUSEDOWN_STYLE
 */
const MOUSEDOWN_STYLE = {
  boxShadow: `0px 15px 20px -17px ${Colors.blackDarker}`,
  transform: `scale(0.98)`,
}
interface Props {
  isDarkMode: boolean
  lg: boolean
  md: boolean
  sm: boolean
  textSm: boolean
}

/**
 * # Button
 * A *not-too-shabbily* styled button
 *
 * @param {Props} props
 *
 * @usage
 *
 * ```jsx
 * <Button isDarkMode={isDarkMode} lg>
 *   <label>Press me</label>
 *   <span>we need span here for global style update</span>
 * </Button>
 * ```
 */
const Renderer = styled(animated.div)`
  background: ${Colors.silverLight};
  border-radius: 5px;
  font-size: ${props => props.textSm && `10px`};
  line-height: 1.2;
  display: inline-block;
  text-align: center;
  padding: 0 ${rhythm(0.5)} ${rhythm(0.5)};
  margin: ${rhythm(0.5)};
  width: ${(props: Props) =>
    props.lg ? `600` : props.md ? `400` : props.sm ? `200` : `100`}px;

  ${(props: Props) =>
    props.isDarkMode &&
    css`
      background: ${Colors.blackLight};
    `}

  label {
    display: flex;
    width: 100%;
    justify-content: center;
    ${scale(-0.5)}
  }
`
export const Button = props => {
  const [springProps, set] = useSpring(() => ({
    from: { ...FROM_STYLE },
  }))
  const bind = useGesture({
    onHover: ({ hovering }) => {
      set(hovering ? MOUSEOVER_STYLE : FROM_STYLE)
    },
    onDrag: ({ down, hovering }) => {
      set(down ? MOUSEDOWN_STYLE : hovering ? MOUSEOVER_STYLE : FROM_STYLE)
    },
  })

  return <Renderer {...props} style={{ ...springProps }} {...bind()} />
}
