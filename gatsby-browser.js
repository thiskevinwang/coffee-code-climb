import React, { useEffect, memo } from "react"
import { Provider, useDispatch, useSelector } from "react-redux"
import { useMediaQuery } from "@material-ui/core"
import { ThemeProvider, createGlobalStyle, css } from "styled-components"

import { store, setIsDarkMode } from "_reduxState"
import { ApolloProvider, client } from "./src/apollo"
import DARK_THEME from "./src/Themes/dark"
import LIGHT_THEME from "./src/Themes/light"

import { SvgTrail } from "./src/components/HOCs/withSVGTrail"

const GlobalStyle = createGlobalStyle`
  .TOC {
    transition-property: font-size, box-shadow;
    transition-duration: "200ms";
    transition-timing-function: "ease-in-out";
  }
    
  .TOC.TOC__FOCUS {
    font-size: 24px !important;
    will-change: font-size;
  }
  
  .HEADER {
    transition: color 200ms ease-in-out;
    will-change: color;
  }
    
  .HEADER.HEADER__FOCUS {
    color: ${(props) => (props.isDarkMode ? "#f81ce5" : "#79ffe1")};
  }

  ${(props) =>
    props.isDarkMode &&
    css`
      .MuiSkeleton-wave {
        background: rgba(255, 255, 255, 0.05) !important;
      }
      .MuiSkeleton-wave::after {
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.14),
          transparent
        ) !important;
      }
    `}
`

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
      <GlobalStyle isDarkMode={isDarkMode} />
      {children}
    </ThemeProvider>
  )
})

// export const wrapRootElement vs. exports.wrapRootElement...
export const wrapRootElement = ({ element }) => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <SvgTrail />
        <ColorSchemeProvider>{element}</ColorSchemeProvider>
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
