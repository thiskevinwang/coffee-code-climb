import { createStore, applyMiddleware, compose } from "redux"

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
export const setLayoutVersion = (layoutVersion: number) => async (
  dispatch,
  getState
) => {
  return dispatch({ type: SET_LAYOUT_VERSION, layoutVersion })
}
export const setPostsVersion = (postsVersion: number) => async (
  dispatch,
  getState
) => {
  return dispatch({ type: SET_POSTS_VERSION, postsVersion })
}
export const setShowMobileMenu = (showMobileMenu: boolean) => async (
  dispatch,
  getState
) => {
  return dispatch({ type: SET_SHOW_MOBILE_MENU, showMobileMenu })
}

/**
 * actionTypes
 */
const TOGGLE_DARKMODE = "TOGGLE_DARKMODE"
const TOGGLE_TRAIL = "TOGGLE_TRAIL"
const TOGGLE_SLOWMO = "TOGGLE_SLOWMO"
const SET_LAYOUT_VERSION = "SET_LAYOUT_VERSION"
const SET_POSTS_VERSION = "SET_POSTS_VERSION"
const SET_SHOW_MOBILE_MENU = "SET_SHOW_MOBILE_MENU"

export interface RootState {
  isDarkMode: boolean
  showTrail: boolean
  slowMo: boolean
  layoutVersion: number
  postsVersion: number
}
/**
 * initialState
 */
const initialState: RootState = {
  isDarkMode: false,
  showTrail: false,
  slowMo: false,
  layoutVersion: 2,
  postsVersion: 1,
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
    case SET_LAYOUT_VERSION:
      return { ...state, layoutVersion: action.layoutVersion }
    case SET_POSTS_VERSION:
      return { ...state, postsVersion: action.postsVersion }
    case SET_SHOW_MOBILE_MENU:
      return { ...state, showMobileMenu: action.showMobileMenu }
    default:
      return state
  }
}

// Enable Redux Dev Tools
const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose

const enhancer = composeEnhancers(
  applyMiddleware(
    logger,
    thunk,
    timeoutScheduler,
    readyStatePromise,
    vanillaPromise
  )
)

/**
 * store
 * - reducer,
 * - preloadedState?
 * - enhancer?
 */
export const store = createStore(reducer, initialState, enhancer)
