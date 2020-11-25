import * as React from "react"
import { useField, ErrorMessage } from "formik"
import styled, { BaseProps } from "styled-components"
import { animated } from "react-spring"

interface Props {
  hasError: boolean
}
const FieldRenderer = styled(animated.div)<Props>`
  display: flex;
  flex-direction: column;
  margin-bottom: 2.5rem;
  position: relative;

  > input {
    ::selection {
      background: var(--geist-selection);
    }
    ::-moz-selection {
      background: var(--geist-selection);
    }
    caret-color: var(--geist-selection);

    height: 2.8rem;
    background: var(--accents-1);
    border-color: ${(props) =>
      props.hasError ? "var(--geist-error)" : "var(--accents-2)"};
    border-width: 1px;
    border-style: solid;
    border-radius: 0.25rem;
    color: var(--geist-foreground);
    transition: border-color 150ms ease-in-out, background 150ms ease-in-out;
    will-change: border-color, background;
    padding-left: 0.4rem;
    outline: none;
  }

  > input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus {
    -webkit-text-fill-color: var(--geist-foreground);
    -webkit-box-shadow: 0 0 0px 1000px var(--accents-1) inset;
    box-shadow: 0 0 0px 1000px var(--accents-1) inset;
  }

  > input:focus {
    border-color: ${(props) =>
      props.hasError ? "var(--geist-error)" : "var(--geist-foreground)"};
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
    transform: translateY(-1.1rem);
    opacity: 1;
  }

  > label {
    border-radius: 0.25rem;
    font-size: 0.7rem;
    opacity: 0;
    transition: opacity 150ms ease-in-out, transform 150ms ease-in-out,
      background 150ms ease-in-out;
    will-change: opacity transform background;
    position: absolute;
    left: 0.4rem;
    text-transform: uppercase;

    color: ${(props) =>
      props.hasError ? "var(--geist-error)" : "var(--geist-foreground)"};
  }
`

FieldRenderer.defaultProps = {
  hasError: false,
}

const FieldError = styled(animated.div)`
  font-size: 0.7rem;
  right: 0rem;
  position: absolute;
  color: var(--geist-error);
  transform: translateY(2.7rem);
`

interface FieldProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
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
      <ErrorMessage name={props.name}>
        {(msg) => <FieldError>{msg}</FieldError>}
      </ErrorMessage>
    </FieldRenderer>
  )
}
