import styled from "styled-components"
import { animated } from "react-spring"

const AnimatedDottedBackground = styled(animated.div)`
  background-image: -webkit-repeating-radial-gradient(
    center center,
    ${props =>
      props.isDarkMode ? `rgba(255, 255, 255, 0.8)` : `rgba(0, 0, 0, 0.5)`},
    ${props =>
        props.isDarkMode ? `rgba(255, 255, 255, 0.8)` : `rgba(0, 0, 0, 0.5)`}
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
