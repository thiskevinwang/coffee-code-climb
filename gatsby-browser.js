import * as React from "react"
// import ReactDOM from "react-dom"
import { Provider, useDispatch } from "react-redux"
import { useMediaQuery } from "@material-ui/core"
// import { Transition } from "react-transition-group"
// import { useSpring, animated } from "react-spring"

import { store, setIsDarkMode } from "_reduxState"
import {
  ApolloProvider,
  client,
  CREATE_PAGE,
  INCREMENT_VIEWS,
  TRACK_IP_VISITS,
} from "./src/apollo"

/**
 * @TODO export this if context is needed elsewhere
 */
const PrefersDarkColorSchemeContext = React.createContext(false)

const ColorSchemeProvider = ({ children }) => {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)")
  const dispatch = useDispatch()
  React.useEffect(() => {
    dispatch(setIsDarkMode(prefersDark))
  }, [prefersDark])

  return (
    <PrefersDarkColorSchemeContext.Provider value={prefersDark}>
      {children}
    </PrefersDarkColorSchemeContext.Provider>
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
 * @deprecated 12-15-2019
 * - This code for an old apollo server -> DynamoDB, before I knew any DB logic.
 * - Moving to a new apollo server -> RDS
 */
// export const onRouteUpdate = async (
//   { location, prevLocation, ...rest },
//   plugins
// ) => {
//   /**
//    * shared vars for client mutations
//    */
//   const variables = { id: 1, location: location.href }

//   try {
//     await client
//       .mutate({
//         mutation: CREATE_PAGE,
//         variables: variables,
//       })
//       .then(result => {})
//   } catch (err) {
//     console.error("I think this page was already created:", err)
//   }

//   try {
//     await client
//       .mutate({
//         mutation: INCREMENT_VIEWS,
//         variables: variables,
//       })
//       .then(result => {
//         console.log(
//           "INCREMENT_VIEWS",
//           location.href,
//           result.data.incrementViews.views
//         )
//       })
//   } catch (error) {
//     console.error("INCREMENT_VIEWS:", error)
//   }
// }

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
