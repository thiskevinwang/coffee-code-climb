// custom typefaces
import "typeface-montserrat"
import "typeface-merriweather"
import "prismjs/themes/prism.css"

import React from "react"
import { Provider } from "react-redux"
import { createStore } from "redux"

/**
 * initialState
 */
const initialState = {
  isDarkMode: false,
}

/**
 * actionTypes
 */
const TOGGLE_DARKMODE = "TOGGLE_DARKMODE"

/**
 * action
 */
export const setIsDarkMode = isDarkMode => {
  return {
    type: TOGGLE_DARKMODE,
    isDarkMode,
  }
}

/**
 * reducer
 */
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_DARKMODE:
      return { ...state, isDarkMode: action.isDarkMode }
    default:
      return state
  }
}

/**
 * store
 */
const store = createStore(reducer, initialState)

// export const wrapRootElement vs. exports.wrapRootElement...
export const wrapRootElement = ({ element }) => {
  return <Provider store={store}>{element}</Provider>
}
