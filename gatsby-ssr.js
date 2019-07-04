import * as React from "react"
import { Provider } from "react-redux"

import { store } from "./src/state"

// NOTE:
// For redux to cooperate with gatsby when running `npm run build`
// We need to use gatsby-ssr.js instead of gatsby-browser.js

// export const wrapRootElement vs. exports.wrapRootElement...
export const wrapRootElement = ({ element }) => {
  return <Provider store={store}>{element}</Provider>
}
