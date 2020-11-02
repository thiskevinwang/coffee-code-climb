import { CognitoIdentityServiceProvider } from "aws-sdk"
import { useReducer, useState } from "react"

import { cognito } from "./AWS"
import { verifyTokenAsync } from "./jwt"

enum OpNames {
  SIGN_UP_WITH_EMAIL = "signUpWithEmail",
  CONFIRM_SIGN_UP = "confirmSignUp",
  INITIATE_AUTH = "initiateAuth",
  INITIATE_AUTH_FOR_REFRESH_TOKEN = "initiateAuthForRefreshToken",
}

const BLANK_STATE = { error: null, data: null }
const INITIAL_STATE = {
  [OpNames.SIGN_UP_WITH_EMAIL]: BLANK_STATE,
  [OpNames.CONFIRM_SIGN_UP]: BLANK_STATE,
  [OpNames.INITIATE_AUTH]: BLANK_STATE,
  [OpNames.INITIATE_AUTH_FOR_REFRESH_TOKEN]: BLANK_STATE,
}

type Action = {
  name: OpNames
  value: any
  type: ActionTypes
}

enum ActionTypes {
  SUCCESS = "success",
  ERROR = "error",
}

function reducer(state: typeof INITIAL_STATE, action: Action) {
  if (action.type === ActionTypes.ERROR) {
    return { ...state, [action.name]: { error: action.value, data: null } }
  } else if (action.type === ActionTypes.SUCCESS) {
    return { ...state, [action.name]: { error: null, data: action.value } }
  }
  throw new Error(`action.type must be one of ${Object.values(ActionTypes)}`)
}

const makeSignUpWithEmail = (
  dispatch: React.Dispatch<Action>,
  opName: OpNames
) => async (email: string, password: string) => {
  console.group("cogSignUpWithEmail")

  const params: CognitoIdentityServiceProvider.SignUpRequest = {
    ClientId: process.env.COGNITO_CLIENT_ID as string,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
    ],
  }

  try {
    const data = await cognito.signUp(params).promise()
    dispatch({
      type: ActionTypes.SUCCESS,
      name: opName,
      value: data,
    })
  } catch (err) {
    dispatch({
      type: ActionTypes.ERROR,
      name: opName,
      value: err.toString(),
    })
  }

  console.groupEnd()
}

const makeConfirmSignUp = (
  dispatch: React.Dispatch<Action>,
  opName: OpNames
) => async (email: string, confirmationCode: string) => {
  console.group("cogConfirmSignUp")

  const params: CognitoIdentityServiceProvider.ConfirmSignUpRequest = {
    ClientId: process.env.COGNITO_CLIENT_ID as string,
    Username: email,
    ConfirmationCode: confirmationCode,
  }

  try {
    const data = await cognito.confirmSignUp(params).promise()
    dispatch({
      type: ActionTypes.SUCCESS,
      name: opName,
      value: data,
    })
  } catch (err) {
    dispatch({
      type: ActionTypes.ERROR,
      name: opName,
      value: err.toString(),
    })
  }

  console.groupEnd()
}

const makeInitateAuth = (
  dispatch: React.Dispatch<Action>,
  opName: OpNames
) => async (email: string, password: string) => {
  console.group("cogInitateAuth")

  const params: CognitoIdentityServiceProvider.InitiateAuthRequest = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: process.env.COGNITO_CLIENT_ID as string,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  }

  try {
    const data = await cognito.initiateAuth(params).promise()
    dispatch({
      type: ActionTypes.SUCCESS,
      name: opName,
      value: data,
    })
    localStorage.setItem("cognito", JSON.stringify(data))
  } catch (err) {
    dispatch({
      type: ActionTypes.ERROR,
      name: opName,
      value: err.toString(),
    })
  }
  console.groupEnd()
}

/**
 * A higher order function.
 */
const makeInitateAuthForRefreshToken = (
  dispatch: React.Dispatch<Action>,
  opName: OpNames
) => async (email: string, refreshToken: string) => {
  console.group("cogInitateAuth-RefreshToken")

  const params: CognitoIdentityServiceProvider.InitiateAuthRequest = {
    AuthFlow: "REFRESH_TOKEN",
    ClientId: process.env.COGNITO_CLIENT_ID as string,
    AuthParameters: {
      USERNAME: email,
      REFRESH_TOKEN: refreshToken,
    },
  }

  try {
    const data = await cognito.initiateAuth(params).promise()
    dispatch({
      type: ActionTypes.SUCCESS,
      name: opName,
      value: data,
    })
    localStorage.setItem("cognito", JSON.stringify(data))
  } catch (err) {
    dispatch({
      type: ActionTypes.ERROR,
      name: opName,
      value: err.toString(),
    })
  }
  console.groupEnd()
}

const useVerify = () => {
  const [decodedToken, setDecodedToken] = useState("")
  /**
   * The `token` argument for this method is expected to be a string,
   * from local storage
   */
  const verify = async (token: string) => {
    const decoded = await verifyTokenAsync(token)
    setDecodedToken(decoded)
  }
  return { decodedToken, verify }
}

/**
 * React hook for various Cognito API methods
 */
export const useCognito = () => {
  const [ops, dispatch] = useReducer(reducer, INITIAL_STATE)
  const { decodedToken, verify } = useVerify()

  return {
    ops,
    signUpWithEmail: makeSignUpWithEmail(dispatch, OpNames.SIGN_UP_WITH_EMAIL),
    confirmSignUp: makeConfirmSignUp(dispatch, OpNames.CONFIRM_SIGN_UP),
    initiateAuth: makeInitateAuth(dispatch, OpNames.INITIATE_AUTH),
    initiateAuthForRefreshToken: makeInitateAuthForRefreshToken(
      dispatch,
      OpNames.INITIATE_AUTH_FOR_REFRESH_TOKEN
    ),
    verifyToken: verify,
    decodedToken,
  }
}
