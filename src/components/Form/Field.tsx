import * as React from "react"
import { useField } from "formik"
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
  margin-bottom: 2.5rem;
  position: relative;

  > input {
    background: ${background};
    border-color: ${theme("mode", {
      light: props => (props.hasError ? "red" : borderColorBase),
      dark: props => (props.hasError ? "darkred" : borderColorBase),
    })};
    border-width: 1px;
    border-style: solid;
    border-radius: 0.25rem;
    color: ${color};
    transition: border-color 150ms ease-in-out, background 150ms ease-in-out;
    will-change: border-color, background;
    padding-left: 0.4rem;
    outline: none;
  }

  > input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus {
    -webkit-text-fill-color: ${color};
    -webkit-box-shadow: 0 0 0px 1000px ${background} inset;
    box-shadow: 0 0 0px 1000px ${background} inset;
  }

  > input:focus {
    border-color: ${theme("mode", {
      light: props => (props.hasError ? "red" : borderColorFocus),
      dark: props => (props.hasError ? "darkred" : borderColorFocus),
    })};
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

FieldRenderer.defaultProps = {
  hasError: false,
}

const FieldError = styled(animated.div)`
  font-size: 0.7rem;
  right: 5px;
  position: absolute;
  color: ${theme("mode", {
    light: "red",
    dark: "darkred",
  })};
  transform: translateY(2rem);
`

interface FieldProps {
  id: string
  name: string
  type: string
  label: string
  placeholder: string
}

export const Field = ({ label, ...props }: FieldProps) => {
  const [field, meta] = useField(props)
  return (
    <FieldRenderer hasError={meta.touched && meta.error}>
      <input {...field} {...props} />
      <label htmlFor={props.id ?? props.name}>{label}</label>
      {meta.touched && meta.error ? (
        <FieldError>{meta.error}</FieldError>
      ) : null}
    </FieldRenderer>
  )
}
