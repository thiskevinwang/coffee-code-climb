import { useState, useEffect, useDebugValue } from "react"
import jwt from "jsonwebtoken"

import { isBrowser } from "utils"

/**
 * - Checks local storage for `token`
 * - Adds `onstorage` event listener to update state accordingly
 *
 * @returns {object} `{ currentUserId }`
 */
export function useAuthentication() {
  const token = isBrowser() ? localStorage.getItem("token") ?? "" : ""
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
