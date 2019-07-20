import React from "react"
import styled, { css } from "styled-components"
import { rhythm, scale } from "src/utils/typography"

import { MUIBoxShadow, MUIBoxShadowHover } from "consts"
import * as Colors from "consts/Colors"

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
 * <Button isDarkMode={isDarkMode} lg>Press me</Button>
 * ```
 */
export const Button = styled.div`
  background: ${Colors.silverLight};
  border: 1px solid ${Colors.black};
  border-radius: 5px;
  box-shadow: ${MUIBoxShadow};
  font-size: ${props => props.textSm && `10px`};
  line-height: 1.2;
  display: inline-block;
  text-align: center;
  padding: 0 ${rhythm(0.5)} ${rhythm(0.5)};
  margin: ${rhythm(0.5)};
  width: ${(props: Props) =>
    props.lg ? `600` : props.md ? `400` : props.sm ? `200` : `100`}px;

  transition: all 200ms ease-in-out;

  ${(props: Props) =>
    props.isDarkMode &&
    css`
      background: ${Colors.blackLight};
      border: 1px solid ${Colors.silverLight};
    `}

  label {
    display: flex;
    width: 100%;
    justify-content: center;
    ${scale(-0.5)}
  }

  :hover {
    box-shadow: ${MUIBoxShadowHover};
    transform: translate(0px, -5px) scale(1.05);
  }
  :active {
    transform: translate(0px, -5px) scale(1.15);
    transition: transform 100ms ease-in-out;
  }
`
