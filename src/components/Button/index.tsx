import React, { ButtonHTMLAttributes } from "react"
import styled from "styled-components"
import { animated, useSpring, config } from "react-spring"
import { useGesture } from "react-use-gesture"

const FROM_STYLE = {
  transform: `scale(1)`,
}

const MOUSEOVER_STYLE = {
  transform: `scale(1.1)`,
}

const MOUSEDOWN_STYLE = {
  transform: `scale(0.98)`,
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Renderer = styled(animated.button)<Props>`
  background: var(--background);
  color: ${(p) => (p.disabled ? "var(--table-border)" : "var(--text)")};
  box-shadow: var(--shadow);

  border-radius: 5px;
  border-style: solid;
  border-width: 0;

  padding: 0 var(--geist-gap-half);
  height: var(--geist-form-small-height);
  font-size: var(--geist-form-small-font);
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
export const Button: React.FC<Props> = (props) => {
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
      {...props}
      style={{ ...springProps, ...props.style }}
      {...bind()}
    />
  )
}
