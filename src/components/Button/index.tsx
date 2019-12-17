import React from "react"
import { useSelector } from "react-redux"
import styled, { css } from "styled-components"
import { animated, useSpring, config } from "react-spring"
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
  transform: `scale(1.1)`,
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
  textSm: boolean
  widthRem?: number
}

const Renderer = styled(animated.button)`
  background: ${Colors.silverLighter};
  border-radius: 5px;
  font-size: ${props => props.textSm && `12px`};
  line-height: 1.2;
  display: inline-block;
  text-align: center;
  padding: ${rhythm(0.5)};
  margin: 5px;

  ${(props: Props) =>
    props.isDarkMode &&
    css`
      background: ${Colors.blackLight};
      color: ${Colors.silverLight};
    `};

  > label {
    background: ${props =>
      props.isDarkMode ? Colors.greyDarker : Colors.greyLighter};
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
  const isDarkMode = useSelector(state => state.isDarkMode)
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
      isDarkMode={isDarkMode}
      {...props}
      style={{ ...springProps, width: `${props.widthRem}rem` }}
      {...bind()}
    />
  )
}
