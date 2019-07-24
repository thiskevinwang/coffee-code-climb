import * as React from "react"
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
export const setVibrate = vibrate => {
  return {
    type: TOGGLE_VIBRATE,
    vibrate,
  }
}

/**
 * actionTypes
 */
const TOGGLE_DARKMODE = "TOGGLE_DARKMODE"
const TOGGLE_TRAIL = "TOGGLE_TRAIL"
const TOGGLE_SLOWMO = "TOGGLE_SLOWMO"
const TOGGLE_VIBRATE = "TOGGLE_VIBRATE"

/**
 * initialState
 */
const initialState = Object.assign(
  {},
  {
    isDarkMode: false,
    showTrail: false,
    slowMo: false,
    vibrate: false,
  }
)
/**
 * reducer
 */
const reducer = (state = initialState, action: Object) => {
  switch (action.type) {
    case TOGGLE_DARKMODE:
      return { ...state, isDarkMode: action.isDarkMode }
    case TOGGLE_TRAIL:
      return { ...state, showTrail: action.showTrail }
    case TOGGLE_SLOWMO:
      return { ...state, slowMo: action.slowMo }
    case TOGGLE_VIBRATE:
      return { ...state, vibrate: action.vibrate }
    default:
      return state
  }
}

/**
 * store
 */
export const store = createStore(reducer, initialState)
