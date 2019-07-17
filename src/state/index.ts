import * as React from "react"
import { Provider } from "react-redux"
import { createStore } from "redux"

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
export const setSlowMo = slowMo => {
  return {
    type: TOGGLE_SLOWMO,
    slowMo,
  }
}

/**
 * actionTypes
 */
const TOGGLE_DARKMODE = "TOGGLE_DARKMODE"
const TOGGLE_TRAIL = "TOGGLE_TRAIL"
const TOGGLE_SLOWMO = "TOGGLE_SLOWMO"

/**
 * initialState
 */
const initialState = {
  isDarkMode: false,
  showTrail: false,
  slowMo: false,
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
    case TOGGLE_SLOWMO:
      return { ...state, slowMo: action.slowMo }
    default:
      return state
  }
}

/**
 * store
 */
export const store = createStore(reducer, initialState)
