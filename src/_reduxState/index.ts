import {
  createStore,
  compose,
  Reducer,
  AnyAction,
  combineReducers,
} from "redux"
import Cognito from "aws-sdk/clients/cognitoidentityserviceprovider"
import { AWSError } from "aws-sdk"
import { ApolloError } from "@apollo/client"

/**
 * action
 */
export const setIsDarkMode = (isDarkMode: boolean): AnyAction => {
  return {
    type: ActionTypes.TOGGLE_DARKMODE,
    isDarkMode,
  }
}
export const setShowTrail = (showTrail: boolean): AnyAction => {
  return {
    type: ActionTypes.TOGGLE_TRAIL,
    showTrail,
  }
}
export const setSlowMo = (slowMo: boolean): AnyAction => {
  return {
    type: ActionTypes.TOGGLE_SLOWMO,
    slowMo,
  }
}
export const setLayoutVersion = (layoutVersion: number): AnyAction => {
  return { type: ActionTypes.SET_LAYOUT_VERSION, layoutVersion }
}
export const setPostsVersion = (postsVersion: number): AnyAction => {
  return { type: ActionTypes.SET_POSTS_VERSION, postsVersion }
}
export const setShowMobileMenu = (showMobileMenu: boolean): AnyAction => {
  return { type: ActionTypes.SET_SHOW_MOBILE_MENU, showMobileMenu }
}

type Data =
  | (Cognito.InitiateAuthResponse &
      Cognito.ForgotPasswordResponse &
      Cognito.ConfirmForgotPasswordResponse)
  | null

/**
 * A action with 1 side effect.
 * - saves the `data` to localstorage
 * - this could be scaled up by redux-persist
 */
export const setCognito = (
  data: Data,
  error: AWSError | ApolloError | null
): AnyAction => {
  window.localStorage.setItem("cognito", JSON.stringify(data))
  return {
    type: ActionTypes.SET_COGNITO,
    data,
    error,
  }
}

/**
 * actionTypes
 */
enum ActionTypes {
  TOGGLE_DARKMODE = "TOGGLE_DARKMODE",
  TOGGLE_TRAIL = "TOGGLE_TRAIL",
  TOGGLE_SLOWMO = "TOGGLE_SLOWMO",
  SET_LAYOUT_VERSION = "SET_LAYOUT_VERSION",
  SET_POSTS_VERSION = "SET_POSTS_VERSION",
  SET_SHOW_MOBILE_MENU = "SET_SHOW_MOBILE_MENU",
  SET_COGNITO = "SET_COGNITO",
}

export interface RootState {
  isDarkMode: boolean
  showTrail: boolean
  slowMo: boolean
  layoutVersion: number
  postsVersion: number
  [StateKeys.COGNITO]: {
    data: Data
    error: AWSError | null
    status: "idle" | "loading" | "succeeded" | "failed"
  }
}

enum StateKeys {
  APP = "app",
  COGNITO = "cognito",
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
  [StateKeys.COGNITO]: {
    data: JSON.parse(
      typeof window !== "undefined"
        ? window.localStorage.getItem("cognito") ?? "{}"
        : "{}"
    ),
    error: null,
    status: "idle",
  },
}

/**
 * #rootReducer
 */
const rootReducer: Reducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.TOGGLE_DARKMODE:
      return { ...state, isDarkMode: action.isDarkMode }
    case ActionTypes.TOGGLE_TRAIL:
      return { ...state, showTrail: action.showTrail }
    case ActionTypes.TOGGLE_SLOWMO:
      return { ...state, slowMo: action.slowMo }
    case ActionTypes.SET_LAYOUT_VERSION:
      return { ...state, layoutVersion: action.layoutVersion }
    case ActionTypes.SET_POSTS_VERSION:
      return { ...state, postsVersion: action.postsVersion }
    case ActionTypes.SET_SHOW_MOBILE_MENU:
      return { ...state, showMobileMenu: action.showMobileMenu }
    case ActionTypes.SET_COGNITO:
      return { ...state, cognito: { data: action.data, error: action.error } }
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

// for future: The way to add middleware is
// const enhancer = composeEnhancers(applyMiddleware(thunk))
const enhancer = composeEnhancers()

export const store = createStore(rootReducer, initialState, enhancer)
