import { useState, useEffect, useDebugValue } from "react"
import { useSelector } from "react-redux"
import jwt, { TokenExpiredError } from "jsonwebtoken"
import { SigningKeyNotFoundError } from "jwks-rsa"

import { useVerify } from "utils/Playground/useCognito"
import type { RootState } from "_reduxState"

/**
 * - Checks local storage for `token`
 * - Adds `onstorage` event listener to update state accordingly
 *
 * @returns {object} `{ currentUserId }`
 */
export function useAuthentication() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : ""
  const [currentUserId, setCurrentUserId] = useState<number | null>()
  useDebugValue(currentUserId)

  useEffect(() => {
    jwt.verify(
      token,
      process.env.GATSBY_APP_SECRET as string,
      (err, decoded) => {
        const userId = decoded?.userId
        if (userId) {
          setCurrentUserId(userId)
        }
      }
    )

    if (typeof window !== "undefined") {
      window.onstorage = () => {
        const _token = window.localStorage.getItem("token")
        if (!_token) {
          setCurrentUserId(null)
        }
      }
    }
  }, [])

  return { currentUserId }
}

/**
 * returns a decoded AccessToken & IdToken
 */
export function useNewAuthentication() {
  const authResponse = useSelector((state: RootState) => state.cognito?.data)

  const accessToken = authResponse?.AuthenticationResult?.AccessToken
  // const refreshToken = authResponse?.AuthenticationResult?.RefreshToken
  const idToken = authResponse?.AuthenticationResult?.IdToken

  const [decodedAccessToken, verifyAccessToken] = useVerify()
  const [decodedIdToken, verifyIdToken] = useVerify()

  useEffect(() => {
    verifyAccessToken(accessToken as string)
  }, [accessToken])

  useEffect(() => {
    verifyIdToken(idToken as string)
  }, [idToken])

  if (decodedAccessToken instanceof TokenExpiredError) {
  } else if (decodedAccessToken instanceof SigningKeyNotFoundError) {
  }

  return { decodedAccessToken, decodedIdToken }
}
