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
  showTrail: true,
}

/**
 * actionTypes
 */
const TOGGLE_DARKMODE = "TOGGLE_DARKMODE"
const TOGGLE_TRAIL = "TOGGLE_TRAIL"

/**
 * action
 */
export const setIsDarkMode = isDarkMode => {
  return {
    type: TOGGLE_DARKMODE,
    isDarkMode,
  }
}
export const setShowTrail = showTrail => {
  return {
    type: TOGGLE_TRAIL,
    showTrail,
  }
}

/**
 * reducer
 */
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_DARKMODE:
      return { ...state, isDarkMode: action.isDarkMode }
    case TOGGLE_TRAIL:
      return { ...state, showTrail: action.showTrail }
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
