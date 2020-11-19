import React from "react"
import styled from "styled-components"

import { LoadingIndicator } from "components/LoadingIndicator"
import { useSelector } from "react-redux"
import { useSpring, animated } from "react-spring"
import { Colors } from "consts/Colors"

const FullPage = styled(animated.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
`

const useAnimatedBg = () => {
  const isDarkMode = useSelector((state: any) => state.isDarkMode)
  const { background } = useSpring({
    background: isDarkMode ? Colors.BLACK_DARKER : Colors.SILVER_LIGHT,
  })
  return { style: { background } }
}

export const LoadingPage = () => {
  const props = useAnimatedBg()
  return (
    <FullPage {...props}>
      <LoadingIndicator style={{ fontSize: 96 }} />
    </FullPage>
  )
}
