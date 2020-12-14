import styled, { css } from "styled-components"
import { animated } from "react-spring"

type Props = {
  secondary?: boolean
}
export const SubmitButton = styled(animated.button)<Props>`
  --button-fg: var(--geist-background);
  --button-bg: var(--geist-foreground);
  --button-border: var(--geist-foreground);
  --button-fg-hover: var(--geist-foreground);
  --button-bg-hover: undefined;
  --button-border-hover: var(--geist-foreground);

  ${(props) =>
    props.secondary &&
    css`
      --button-fg: var(--accents-5);
      --button-bg: var(--geist-background);
      --button-border: var(--accents-2);
      --button-fg-hover: var(--geist-foreground);
      --button-bg-hover: var(--geist-background);
      --button-border-hover: var(--geist-foreground);
    `}

  background: var(--button-bg);
  border-color: var(--button-border);
  border-width: 1px;
  border-radius: var(--geist-radius);
  border-style: solid;
  color: var(--button-fg);
  cursor: pointer;
  font-size: 14px;
  height: var(--geist-form-small-height);
  min-width: 80px;
  transition: all 200ms ease-in-out;
  user-select: none;
  will-change: background, border-color, color;

  :hover,
  :focus {
    background: var(--button-bg-hover);
    color: var(--button-fg-hover);
    border-color: var(--button-border-hover);
  }

  :disabled {
    background: var(--accents-1);
    border-color: var(--accents-2);
    color: var(--accents-4);
    cursor: not-allowed;
  }
`
