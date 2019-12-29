import { useState, useEffect } from "react"
import jwt from "jsonwebtoken"

/**
 * - Checks local storage for `token`
 * - Adds `onstorage` event listener to update state accordingly
 *
 * @returns {object} `{ currentUserId }`
 */
export function useAuthentication() {
  const token = typeof window !== "undefined" && localStorage.getItem("token")
  const [currentUserId, setCurrentUserId] = useState<number | null>()

  useEffect(() => {
    jwt.verify(token, process.env.GATSBY_APP_SECRET, (err, decoded) => {
      const userId = decoded?.userId
      if (userId) {
        setCurrentUserId(userId)
      }
    })

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
