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
export const setShowBlogImage = (showBlogImage: boolean) =>
  new Promise((res, rej) =>
    res({
      type: TOGGLE_BLOG_IMAGE,
      showBlogImage,
    })
  )
export const setLayoutVersion = (layoutVersion: 1 | 2 | 3) => async (
  dispatch,
  getState
) => {
  return dispatch({ type: SET_LAYOUT_VERSION, layoutVersion })
}
export const setPostsVersion = (postsVersion: 1 | 2 | 3) => async (
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
const TOGGLE_BLOG_IMAGE = "TOGGLE_BLOG_IMAGE"
const SET_LAYOUT_VERSION = "SET_LAYOUT_VERSION"
const SET_POSTS_VERSION = "SET_POSTS_VERSION"
const SET_SHOW_MOBILE_MENU = "SET_SHOW_MOBILE_MENU"

/**
 * initialState
 */
const initialState = {
  isDarkMode: false,
  showTrail: false,
  slowMo: false,
  showBlogImage: true,
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
    case TOGGLE_BLOG_IMAGE:
      return { ...state, showBlogImage: action.showBlogImage }
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
