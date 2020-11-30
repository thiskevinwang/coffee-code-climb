import styled from "styled-components"
import { animated } from "react-spring"

export const SubmitButton = styled(animated.button)`
  background: var(--accents-8);
  border-color: var(--accents-8);
  border-width: 1px;
  border-radius: var(--geist-radius);
  border-style: solid;
  color: var(--accents-1);
  cursor: pointer;
  font-size: 14px;
  height: var(--geist-form-small-height);
  margin-bottom: 2rem;
  min-width: 80px;
  /* outline: none; */
  transition: all 200ms ease-in-out;
  user-select: none;
  will-change: background, border-color, color;

  :hover,
  :focus {
    background: var(--accents-1);
    color: var(--accents-8);
  }

  :disabled {
    background: var(--accents-1);
    border-color: var(--accents-2);
    color: var(--accents-4);
    cursor: not-allowed;
  }
`
