import styled, { BaseProps } from "styled-components"
import { animated } from "react-spring"

const AnimatedDottedBackground = styled(animated.div)`
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 30%;
  transform: skewX(6deg);
  transform-origin: top right;
  z-index: -8998;

  background-image: -webkit-repeating-radial-gradient(
    center center,
    ${(props: BaseProps) =>
      props.theme.mode === "dark"
        ? `rgba(255, 255, 255, 0.8)`
        : `rgba(0, 0, 0, 0.5)`},
    ${(props: BaseProps) =>
        props.theme.mode === "dark"
          ? `rgba(255, 255, 255, 0.8)`
          : `rgba(0, 0, 0, 0.5)`}
      1px,
    transparent 1px,
    transparent 100%
  );
  background-image: -moz-repeating-radial-gradient(
    center center,
    rgba(0, 0, 0, 0.5),
    rgba(0, 0, 0, 0.5) 1px,
    transparent 1px,
    transparent 100%
  );
  background-image: -ms-repeating-radial-gradient(
    center center,
    rgba(0, 0, 0, 0.5),
    rgba(0, 0, 0, 0.5) 1px,
    transparent 1px,
    transparent 100%
  );
  background-image: repeating-radial-gradient(
    center center,
    rgba(0, 0, 0, 0.5),
    rgba(0, 0, 0, 0.5) 1px,
    transparent 1px,
    transparent 100%
  );
  -webkit-background-size: 15px 15px;
  -moz-background-size: 15px 15px;
  background-size: 15px 15px;
`
export { AnimatedDottedBackground }
