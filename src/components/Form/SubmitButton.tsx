import styled, { BaseProps } from "styled-components"
import { animated } from "react-spring"
import theme from "styled-theming"

const background = theme("mode", {
  light: (props: BaseProps) => props.theme.formButton.background,
  dark: (props: BaseProps) => props.theme.formButton.background,
})
const backgroundDisabled = theme("mode", {
  light: (props: BaseProps) => props.theme.formButton.backgroundDisabled,
  dark: (props: BaseProps) => props.theme.formButton.backgroundDisabled,
})
const borderColorDisabled = theme("mode", {
  light: (props: BaseProps) => props.theme.formButton.borderColorDisabled,
  dark: (props: BaseProps) => props.theme.formButton.borderColorDisabled,
})
const backgroundHover = theme("mode", {
  light: (props: BaseProps) => props.theme.formButton.backgroundHover,
  dark: (props: BaseProps) => props.theme.formButton.backgroundHover,
})
const color = theme("mode", {
  light: (props: BaseProps) => props.theme.formButton.color,
  dark: (props: BaseProps) => props.theme.formButton.color,
})
const colorHover = theme("mode", {
  light: (props: BaseProps) => props.theme.formButton.colorHover,
  dark: (props: BaseProps) => props.theme.formButton.colorHover,
})

export const SubmitButton = styled(animated.button)`
  background: ${background};
  border-color: ${background};
  border-width: 1px;
  border-radius: 0.25rem;
  color: ${color};
  width: 7rem;
  margin-bottom: 2rem;
  /* outline: none; */
  transition: background 150ms ease-in-out, border-color 150ms ease-in-out,
    color 150ms ease-in-out;
  will-change: background, border-color, color;

  :hover,
  :focus {
    background: ${backgroundHover};
    color: ${colorHover};
  }

  :disabled {
    background: ${backgroundDisabled};
    border-color: ${borderColorDisabled};
    color: ${borderColorDisabled};
  }
`
