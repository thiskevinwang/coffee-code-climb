import React, { useEffect, memo } from "react"
import { Provider, useDispatch, useSelector } from "react-redux"
import { useMediaQuery } from "@material-ui/core"
import { ThemeProvider } from "styled-components"

import { store, setIsDarkMode } from "_reduxState"
import { ApolloProvider, client } from "./src/apollo"

import DARK_THEME from "./src/Themes/dark"
import LIGHT_THEME from "./src/Themes/light"
import { SvgTrail } from "./src/components/SvgTrail"
import { GlobalStyles, GlobalTypographyStyles } from "./src/globalStyles"

const ColorSchemeProvider = memo(({ children }) => {
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

// NOTE:
// For redux to cooperate with gatsby when running `npm run build`
// We need to use gatsby-ssr.js instead of gatsby-browser.js

// export const wrapRootElement vs. exports.wrapRootElement...
export const wrapRootElement = ({ element }) => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <ColorSchemeProvider>
          <SvgTrail />
          {element}
        </ColorSchemeProvider>
      </Provider>
    </ApolloProvider>
  )
}
