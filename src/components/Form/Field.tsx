import * as React from "react"
import styled, { BaseProps } from "styled-components"
import { animated } from "react-spring"
import theme from "styled-theming"

const background = theme("mode", {
  light: (props: BaseProps) => props.theme.formInput.background,
  dark: (props: BaseProps) => props.theme.formInput.background,
})
const borderColorBase = theme("mode", {
  light: (props: BaseProps) => props.theme.formInput.borderColorBase,
  dark: (props: BaseProps) => props.theme.formInput.borderColorBase,
})
const borderColorFocus = theme("mode", {
  light: (props: BaseProps) => props.theme.formInput.borderColorFocus,
  dark: (props: BaseProps) => props.theme.formInput.borderColorFocus,
})
const color = theme("mode", {
  light: (props: BaseProps) => props.theme.formInput.color,
  dark: (props: BaseProps) => props.theme.formInput.color,
})

const FieldRenderer = styled(animated.div)`
  display: flex;
  flex-direction: column;
  max-width: 15rem;
  margin-bottom: 2rem;
  position: relative;

  > input {
    background: ${background};
    border-color: ${borderColorBase};
    border-width: 1px;
    border-style: solid;
    border-radius: 0.25rem;
    color: ${color};
    transition: border-color 150ms ease-in-out, background 150ms ease-in-out;
    will-change: border-color, background;
    padding-left: 0.4rem;
    outline: none;
  }

  > input:focus {
    border-color: ${borderColorFocus};
  }

  > input::placeholder {
    transition: opacity 150ms ease-in-out;
    will-change: opacity;
  }
  > input:focus::placeholder {
    opacity: 0;
  }

  > input:focus + label,
  > input:not(:placeholder-shown) + label {
    transform: translateY(-1.3rem);
    opacity: 1;
  }

  > label {
    font-size: 0.7rem;
    opacity: 0;
    transition: opacity 150ms ease-in-out, transform 150ms ease-in-out;
    will-change: opacity transform;
    position: absolute;
    left: 5px;
    text-transform: uppercase;
  }
`

type FieldName = string
interface FieldProps {
  id: FieldName
  name: FieldName
  type: FieldName
  placeholder: FieldName
  onChange(): void
}

export const Field = (props: FieldProps) => {
  return (
    <FieldRenderer>
      <input {...props} />
      <label for={props.name}>{props.name}</label>
    </FieldRenderer>
  )
}
