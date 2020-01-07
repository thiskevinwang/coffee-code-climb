import * as React from "react"
// import ReactDOM from "react-dom"
import { Provider, useDispatch, useSelector } from "react-redux"
import { useMediaQuery } from "@material-ui/core"
import { ThemeProvider } from "styled-components"
// import { Transition } from "react-transition-group"
// import { useSpring, animated } from "react-spring"

import { store, setIsDarkMode } from "_reduxState"
import { ApolloProvider, client } from "./src/apollo"
import DARK_THEME from "./src/Themes/dark"
import LIGHT_THEME from "./src/Themes/light"

/**
 * @TODO export this if context is needed elsewhere
 */

const ColorSchemeProvider = ({ children }) => {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)")
  const dispatch = useDispatch()
  React.useEffect(() => {
    dispatch(setIsDarkMode(prefersDark))
  }, [prefersDark, dispatch])
  const isDarkMode = useSelector(state => state.isDarkMode)

  return (
    <ThemeProvider
      theme={
        isDarkMode
          ? { ...DARK_THEME, mode: "dark" }
          : { ...LIGHT_THEME, mode: "light" }
      }
    >
      {children}
    </ThemeProvider>
  )
}

// export const wrapRootElement vs. exports.wrapRootElement...
export const wrapRootElement = ({ element }) => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
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
  /**
   * @deprecated 12-15-2019
   * - This code for an old apollo server -> DynamoDB, before I knew any DB logic.
   * - Moving to a new apollo server -> RDS
   */
  // try {
  //   client.mutate({ mutation: TRACK_IP_VISITS })
  // } catch (error) {
  //   console.error("TRACK_IP_VISITS", error)
  // }
  if (typeof IntersectionObserver === `undefined`) {
    await import(`intersection-observer`)
  }
}

// fires when arriving and leaving...

/**
 * CONCURRENT MODE!!!
 *
 * https://reactjs.org/docs/concurrent-mode-adoption.html
 */
// export const replaceHydrateFunction = () => {
//   return (element, container, callback) => {
//     /**
//      * Old
//      */
//     // ReactDOM.render(element, container, callback);

//     /**
//      * New
//      */
//     ReactDOM.unstable_createRoot(container).render(element)
//   }
// }
