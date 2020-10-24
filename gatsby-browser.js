import React from "react"
import { Provider } from "react-redux"

import { store } from "_reduxState"
import { ApolloProvider, client } from "apollo"
import { SvgTrail } from "components/SvgTrail"
import { ColorSchemeProvider } from "components/ColorSchemeProvider"

import { Facebook } from "components/Facebook"

// export const wrapRootElement vs. exports.wrapRootElement...
export const wrapRootElement = ({ element }) => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <ColorSchemeProvider>
          <Facebook />
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
