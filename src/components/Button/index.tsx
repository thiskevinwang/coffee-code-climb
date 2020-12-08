import React, { ButtonHTMLAttributes, CSSProperties } from "react"
import styled from "styled-components"
import { animated, useSpring, config } from "react-spring"
import { useGesture } from "react-use-gesture"

const FROM_STYLE: CSSProperties = {
  // background: `-webkit-linear-gradient(-70deg, var(--geist-background) 0%, #9867f0 0%, #ed4e50 0%, var(--geist-background) 0%)`,
  o: 0,
  transform: `scale(1)`,
}

const MOUSEOVER_STYLE: CSSProperties = {
  // background: `-webkit-linear-gradient(-70deg, var(--geist-background) 100%, #9867f0 100%, #ed4e50 100%, var(--geist-background) 100%)`,
  o: 1,
  transform: `scale(1.1)`,
}

const MOUSEDOWN_STYLE: CSSProperties = {
  transform: `scale(0.98)`,
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  background?: CSSProperties["background"]
  color?: CSSProperties["color"]
}

const Renderer = styled(animated.button)<Props>`
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  color: ${(p) =>
    p.disabled ? "var(--accents-5)" : p.color || "var(--geist-foreground)"};

  background: ${(p) => p.background || "var(--geist-background)"};
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
  const [{ o, ...springProps }, set] = useSpring(() => ({
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
      style={{
        background: o.interpolate(
          (o) =>
            `-webkit-linear-gradient(-70deg, var(--geist-background) ${
              (o * 1.3 - 0.3) * 100
            }%, #9867f0 ${(o * 1.3 - 0.2) * 100}%, #ed4e50 ${
              (o * 1.3 - 0.1) * 100
            }%, var(--geist-background) ${o * 1.3 * 100}%)`
        ),
        ...springProps,
        ...props.style,
      }}
      {...bind()}
    />
  )
}
