import styled, { BaseProps } from "styled-components"
import { animated } from "react-spring"

export const SubmitButton = styled(animated.button)`
  background: var(--accents-8);
  border-color: var(--accents-8);
  border-width: 1px;
  border-radius: 0.25rem;
  border-style: solid;
  color: var(--accents-1);
  width: 7rem;
  height: var(--geist-form-small-height);
  margin-bottom: 2rem;
  /* outline: none; */
  transition: background 150ms ease-in-out, border-color 150ms ease-in-out,
    color 150ms ease-in-out;
  will-change: background, border-color, color;

  :hover,
  :focus {
    background: var(--accents-1);
    color: var(--accents-8);
  }

  :disabled {
    background: var(--accents-3);
    border-color: var(--accents-6);
    color: var(--accents-6);
  }
`
