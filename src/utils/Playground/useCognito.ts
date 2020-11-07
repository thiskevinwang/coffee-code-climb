import { useCallback, useState } from "react"
import { useDispatch } from "react-redux"
import _ from "lodash"
import type { CognitoIdentityServiceProvider } from "aws-sdk"
import type { Dispatch } from "redux"

import { setCognito } from "_reduxState"

import { cognito } from "./AWS"
import { verifyTokenAsync } from "./jwt"

const makeSignUpWithEmail = (rdxDispatch: Dispatch) => async (
  email: string,
  password: string
) => {
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
  } catch (err) {
    rdxDispatch(setCognito(null, err))
  }

  console.groupEnd()
}

const makeConfirmSignUp = (rdxDispatch: Dispatch) => async (
  email: string,
  confirmationCode: string
) => {
  console.group("cogConfirmSignUp")

  const params: CognitoIdentityServiceProvider.ConfirmSignUpRequest = {
    ClientId: process.env.COGNITO_CLIENT_ID as string,
    Username: email,
    ConfirmationCode: confirmationCode,
  }

  try {
    const data = await cognito.confirmSignUp(params).promise()
  } catch (err) {
    rdxDispatch(setCognito(null, err))
  }

  console.groupEnd()
}

const makeInitateAuth = (rdxDispatch: Dispatch) => async (
  email: string,
  password: string
) => {
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
    rdxDispatch(setCognito(data, null))
  } catch (err) {
    rdxDispatch(setCognito(null, err))
  }
  console.groupEnd()
}

const makeInitateAuthForRefreshToken = (rdxDispatch: Dispatch) => async (
  email: string,
  refreshToken: string
) => {
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
    rdxDispatch(setCognito(data, null))
  } catch (err) {
    rdxDispatch(setCognito(null, err))
  }
  console.groupEnd()
}

const makeForgotPassword = (rdxDispatch: Dispatch) => async (email: string) => {
  const params: CognitoIdentityServiceProvider.ForgotPasswordRequest = {
    ClientId: process.env.COGNITO_CLIENT_ID as string,
    Username: email,
  }

  try {
    const data = await cognito.forgotPassword(params).promise()
    rdxDispatch(setCognito(data, null))
  } catch (err) {
    rdxDispatch(setCognito(null, err))
  }
}

const makeConfirmForgotPassword = (rdxDispatch: Dispatch) => async (
  email: string,
  password: string,
  code: string
) => {
  const params: CognitoIdentityServiceProvider.ConfirmForgotPasswordRequest = {
    ClientId: process.env.COGNITO_CLIENT_ID as string,
    Username: email,
    Password: password,
    ConfirmationCode: code,
  }

  try {
    const data = await cognito.confirmForgotPassword(params).promise()
    rdxDispatch(setCognito(data, null))
  } catch (err) {
    rdxDispatch(setCognito(null, err))
  }
}

/**
 * A utility hook that returns a method to verify a token token
 * with JWKS URI.
 *
 * Also returns the decoded value
 */
export const useVerify = (): [any, (token: string) => Promise<void>] => {
  const [decodedToken, setDecodedToken] = useState(undefined)
  /**
   * The `token` argument for this method is expected to be a string,
   * from local storage
   */
  const verify = async (token: string) => {
    const decoded = await verifyTokenAsync(token)
    setDecodedToken(decoded)
  }
  return [decodedToken, verify]
}

const THROTTLE_INTERVAL = 1500

/**
 * A wrapper hook to
 */
const useThrottle = <T extends (...args: any) => any>(
  func: T
): T & _.Cancelable => {
  return useCallback(_.throttle(func, THROTTLE_INTERVAL), [])
}

/**
 * React hook for various Cognito API methods
 */
export const useCognito = () => {
  const [decodedToken, verify] = useVerify()
  const rdxDispatch = useDispatch()

  // Throttle cognito-calling methods
  const signUpWithEmail = useThrottle(makeSignUpWithEmail(rdxDispatch))
  const confirmSignUp = useThrottle(makeConfirmSignUp(rdxDispatch))
  const initiateAuth = useThrottle(makeInitateAuth(rdxDispatch))
  const initiateAuthForRefreshToken = useThrottle(
    makeInitateAuthForRefreshToken(rdxDispatch)
  )
  const forgotPassword = useThrottle(makeForgotPassword(rdxDispatch))
  const confirmForgotPassword = useThrottle(
    makeConfirmForgotPassword(rdxDispatch)
  )

  return {
    // cognito methods
    signUpWithEmail,
    confirmSignUp,
    initiateAuth,
    initiateAuthForRefreshToken,
    forgotPassword,
    confirmForgotPassword,
    // utils
    verifyToken: verify,
    decodedToken,
  }
}
