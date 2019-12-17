import { useState, useEffect } from "react"
import jwt from "jsonwebtoken"

/**
 * - Checks local storage for `token`
 * - Adds `onstorage` event listener to update state accordingly
 *
 * @returns {boolean} `isAuthenticated`
 */
export function useAuthentication(): boolean {
  const token = typeof window !== "undefined" && localStorage.getItem("token")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    jwt.verify(token, process.env.GATSBY_APP_SECRET, (err, decoded) => {
      const userId = decoded?.userId
      if (userId) {
        setIsAuthenticated(true)
      }
    })

    if (typeof window !== "undefined") {
      window.onstorage = () => {
        const _token = window.localStorage.getItem("token")
        if (!_token) {
          setIsAuthenticated(false)
        }
      }
    }
  }, [])

  return isAuthenticated
}
