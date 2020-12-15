import React, { useState, useEffect } from "react"
import {
  ApolloProvider as Provider,
  ApolloClient,
  HttpLink,
} from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import fetch from "isomorphic-fetch"
import _ from "lodash"

import { initCache } from "./cache"

const __DEV__ = process.env.NODE_ENV !== "production"

// TODO Cleanup netlify env vars
const PROD_API_ENDPOINT = `https://${process.env.GATSBY_RDS_API_ENDPOINT}`
const DEV_API_ENDPOINT = `http://${process.env.GATSBY_DEV_API_ENDPOINT}`

const httpLink = new HttpLink({
  uri: __DEV__ ? DEV_API_ENDPOINT : PROD_API_ENDPOINT,
})

/**
 * @see https://www.apollographql.com/docs/react/networking/authentication/#header
 */
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  let token
  const cognito = localStorage.getItem("cognito")
  if (cognito) {
    token = JSON.parse(cognito)?.AuthenticationResult?.AccessToken
  }
  // return the headers to the context so thhe link can read them

  /**
   * @warning
   * `Authorization` needs to come first, as `headers` may contain
   * an imperatively set `Authorization` from a mutation/query. In
   * that case, we want the later to take precedence over the
   * `Authorization` value here, so we destructure `headers` AFTER
   * `Authorization`
   */
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      ...headers,
    },
  }
})

// const client = new ApolloClient({
//   link: authLink.concat(httpLink),
//   cache: initCache(),
//   /**
//    * Passing fetch here fixes "Webpack Invariant" error when gatsby compiles
//    * https://github.com/gatsbyjs/gatsby/issues/3650#issuecomment-410146046
//    */
//   fetch,
// })

const ApolloProvider: React.ComponentType = ({ children }) => {
  const [client, setClient] = useState<any>(null)
  const [cache, setCache] = useState()

  useEffect(() => {
    initCache().then((cache) => {
      setCache(cache)

      const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache,
        /**
         * Passing fetch here fixes "Webpack Invariant" error when gatsby compiles
         * https://github.com/gatsbyjs/gatsby/issues/3650#issuecomment-410146046
         */
        fetch,
      })

      setClient(client)
    })
  }, [initCache])

  if (!client)
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "var(--geist-background)",
        }}
      >
        Loading
      </div>
    )
  return <Provider client={client}>{children}</Provider>
}

export { ApolloProvider }
