// custom typefaces
import "typeface-montserrat"
import "typeface-merriweather"

import * as React from "react"
import { Provider } from "react-redux"

import { store } from "./src/state"

// export const wrapRootElement vs. exports.wrapRootElement...
export const wrapRootElement = ({ element }) => {
  return <Provider store={store}>{element}</Provider>
}

/**
 * Fix Error:
 * `WebpackError: ReferenceError: IntersectionObserver is not defined`
 * https://github.com/gatsbyjs/gatsby/issues/10435#issuecomment-446627549
 */
export const onClientEntry = async () => {
  if (typeof IntersectionObserver === `undefined`) {
    await import(`intersection-observer`)
  }
}
