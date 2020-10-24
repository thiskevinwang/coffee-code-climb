import React, { useEffect, memo } from "react"
import { Provider, useDispatch, useSelector } from "react-redux"
import { useMediaQuery } from "@material-ui/core"
import { ThemeProvider } from "styled-components"

import { store, setIsDarkMode } from "_reduxState"
import { ApolloProvider, client } from "./src/apollo"
import DARK_THEME from "./src/Themes/dark"
import LIGHT_THEME from "./src/Themes/light"
import { SvgTrail } from "./src/components/HOCs/withSVGTrail"
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

const Facebook = memo(() => {
  useEffect(() => {
    const script = document.createElement("script")
    const appId = "1234150196787151"
    script.innerHTML = `
      window.fbAsyncInit = function() {
        FB.init({
          appId            : '${appId}',
          autoLogAppEvents : true,
          xfbml            : true,
          version          : 'v8.0'
        });
      };
    `
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    // <script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js"></script>
    const script = document.createElement("script")
    script.src = "https://connect.facebook.net/en_US/sdk.js"
    script.async = true
    script.crossOrigin = "anonymous"

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return null
})

// export const wrapRootElement vs. exports.wrapRootElement...
export const wrapRootElement = ({ element }) => {
  return (
    <ApolloProvider client={client}>
      <Facebook />
      <Provider store={store}>
        <ColorSchemeProvider>
          <SvgTrail />
          {element}
        </ColorSchemeProvider>
      </Provider>
    </ApolloProvider>
  )
}

/**
 * Fix Error:
 * `WebpackError: ReferenceError: IntersectionObserver is not defined`
 * https://github.com/gatsbyjs/gatsby/issues/10435#issuecomment-446627549
 */
export const onClientEntry = async (_, plugins) => {
  if (typeof IntersectionObserver === `undefined`) {
    await import(`intersection-observer`)
  }
}
