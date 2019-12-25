import styled from "styled-components"
import { animated } from "react-spring"

export const Avatar = styled(animated.div)`
  min-width: 40px;
  min-height: 40px;
  width: 40px;
  height: 40px;
  border-radius: 100%;
  background: rebeccapurple /* fallback when there's no props.src url */;
  background-image: url(${props => props.src});
  background-position: center;
  background-size: 100%;
  margin-right: 10px;
`
