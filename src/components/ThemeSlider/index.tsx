import React, { useEffect } from "react"
import styled from "styled-components"
import { animated, useSpring } from "react-spring"
import { useSelector, useDispatch } from "react-redux"

import { RootState, setIsDarkMode } from "_reduxState"

const Sun = styled(animated.div)`
  background-image: url(https://pf-emoji-service--cdn.us-east-1.prod.public.atl-paas.net/standard/a51a7674-8d5d-4495-a2d2-a67c090f5c3b/64x64/spritesheets/nature.png);
  background-position: 23.0769% 75%;
  background-size: 1400% 1300%;
  width: 2.15rem;
  height: 2.15rem;
`
const Moon = styled(animated.div)`
  background-image: url(https://pf-emoji-service--cdn.us-east-1.prod.public.atl-paas.net/standard/a51a7674-8d5d-4495-a2d2-a67c090f5c3b/64x64/spritesheets/nature.png);
  background-position: 30.7692% 75%;
  background-size: 1400% 1300%;
  width: 2rem;
  height: 2rem;
`
const Container = styled(animated.div)`
  border-color: lightgrey;
  border-width: 1px;
  border-style: solid;
  border-radius: 25% / 50%;
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: calc(2 * 2rem + 8px);
  height: calc(2rem + 4px);
`

export const ThemeSlider = () => {
  const isDarkMode = useSelector((state: RootState) => state.isDarkMode)
  const dispatch = useDispatch()

  const [moonProps, setMoonProps] = useSpring(() => ({
    opacity: isDarkMode ? 1 : 0,
    transform: `translateX(${isDarkMode ? 0 : 100}%)`,
  }))
  const [sunProps, setSunProps] = useSpring(() => ({
    opacity: isDarkMode ? 0 : 1,
    transform: `translateX(${isDarkMode ? -100 : 0}%)`,
  }))
  useEffect(() => {
    setMoonProps({
      opacity: isDarkMode ? 1 : 0,
      transform: `translateX(${isDarkMode ? 0 : 100}%)`,
    })
    setSunProps({
      opacity: isDarkMode ? 0 : 1,
      transform: `translateX(${isDarkMode ? -100 : 0}%)`,
    })
  }, [isDarkMode])

  const toggleDarkMode = () => dispatch(setIsDarkMode(!isDarkMode))
  return (
    <Container onClick={toggleDarkMode}>
      <Moon style={moonProps} />
      <Sun style={sunProps} />
    </Container>
  )
}
