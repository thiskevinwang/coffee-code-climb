import React from "react"
import { Provider } from "react-redux"

import { store } from "_reduxState"
import { ApolloProvider, client } from "apollo"
import { SvgTrail } from "components/SvgTrail"
import { ColorSchemeProvider } from "components/ColorSchemeProvider"
import { SnackbarProvider } from "src/snackbar"

import "prismjs/plugins/line-numbers/prism-line-numbers.css"
import "./geist-styles.css"

// export const wrapRootElement vs. exports.wrapRootElement...
export const wrapRootElement = ({ element }) => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <SnackbarProvider>
          <ColorSchemeProvider>
            <SvgTrail />
            {element}
          </ColorSchemeProvider>
        </SnackbarProvider>
      </Provider>
    </ApolloProvider>
  )
}
