import React from "react"
import { Provider } from "react-redux"
import { Helmet } from "react-helmet"

import { store } from "_reduxState"
import { ApolloProvider } from "apollo"
import { SvgTrail } from "components/SvgTrail"
import { ColorSchemeProvider } from "components/ColorSchemeProvider"
import { SnackbarProvider } from "src/snackbar"

import "prismjs/plugins/line-numbers/prism-line-numbers.css"
import "./geist-styles.css"

// export const wrapRootElement vs. exports.wrapRootElement...
export const wrapRootElement = ({ element }) => {
  return (
    <ApolloProvider>
      <Provider store={store}>
        <SnackbarProvider>
          <ColorSchemeProvider>
            <Helmet>
              <meta charset="utf-8" />
            </Helmet>
            <SvgTrail />
            {element}
          </ColorSchemeProvider>
        </SnackbarProvider>
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
