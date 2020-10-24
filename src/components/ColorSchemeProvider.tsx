import React, { useEffect, memo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useMediaQuery } from "@material-ui/core"
import { ThemeProvider } from "styled-components"

import { setIsDarkMode } from "_reduxState"
import DARK_THEME from "Themes/dark"
import LIGHT_THEME from "Themes/light"
import { GlobalStyles, GlobalTypographyStyles } from "globalStyles"

/**
 * # ColorSchemeProvider
 *
 * A helper to detect `prefers-color-scheme` and update
 * redux `isDarkMode`
 *
 * Also provides `styled-components` theme context
 *
 * @note This is only to be used from
 * - `gatsby-browser.js`
 * - `gatsby-ssr.js`
 */
export const ColorSchemeProvider = memo(({ children }) => {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)")
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setIsDarkMode(prefersDark))
  }, [prefersDark, dispatch])

  const isDarkMode = useSelector((state) => state.isDarkMode)

  return (
    <ThemeProvider
      theme={
        isDarkMode
          ? { ...DARK_THEME, mode: "dark" }
          : { ...LIGHT_THEME, mode: "light" }
      }
    >
      <GlobalStyles isDarkMode={isDarkMode} />
      <GlobalTypographyStyles isDarkMode={isDarkMode} />
      {children}
    </ThemeProvider>
  )
})
