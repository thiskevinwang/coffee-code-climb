import { createStore, applyMiddleware } from "redux"

import {
  logger,
  thunk,
  timeoutScheduler,
  readyStatePromise,
  vanillaPromise,
} from "./middleware"

/**
 * action
 */
export const setIsDarkMode = (isDarkMode: boolean) => async (
  dispatch,
  getState
) => {
  return dispatch({
    type: TOGGLE_DARKMODE,
    isDarkMode,
  })
}
export const setShowTrail = (showTrail: boolean) => {
  return {
    type: TOGGLE_TRAIL,
    showTrail,
  }
}
export const setSlowMo = (slowMo: boolean) => {
  return {
    type: TOGGLE_SLOWMO,
    slowMo,
  }
}
export const setVibrate = (vibrate: boolean) => {
  return {
    type: TOGGLE_VIBRATE,
    vibrate,
  }
}
export const setShowBlogImage = (showBlogImage: boolean) =>
  new Promise((res, rej) =>
    res({
      type: TOGGLE_BLOG_IMAGE,
      showBlogImage,
    })
  )

/**
 * actionTypes
 */
const TOGGLE_DARKMODE = "TOGGLE_DARKMODE"
const TOGGLE_TRAIL = "TOGGLE_TRAIL"
const TOGGLE_SLOWMO = "TOGGLE_SLOWMO"
const TOGGLE_VIBRATE = "TOGGLE_VIBRATE"
const TOGGLE_BLOG_IMAGE = "TOGGLE_BLOG_IMAGE"

/**
 * initialState
 */
const initialState = {
  isDarkMode: false,
  showTrail: false,
  slowMo: false,
  vibrate: false,
  showBlogImage: true,
}

/**
 * reducer
 */
const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case TOGGLE_DARKMODE:
      return { ...state, isDarkMode: action.isDarkMode }
    case TOGGLE_TRAIL:
      return { ...state, showTrail: action.showTrail }
    case TOGGLE_SLOWMO:
      return { ...state, slowMo: action.slowMo }
    case TOGGLE_VIBRATE:
      return { ...state, vibrate: action.vibrate }
    case TOGGLE_BLOG_IMAGE:
      return { ...state, showBlogImage: action.showBlogImage }
    default:
      return state
  }
}

/**
 * store
 */
export const store = createStore(
  reducer,
  initialState,
  applyMiddleware(
    logger,
    thunk,
    timeoutScheduler,
    readyStatePromise,
    vanillaPromise
  )
)
