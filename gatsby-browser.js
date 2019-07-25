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
