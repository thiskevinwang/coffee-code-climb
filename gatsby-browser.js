import * as React from "react"
import { Provider } from "react-redux"

import { store } from "./src/state"
import {
  ApolloProvider,
  client,
  CREATE_PAGE,
  GET_PAGE,
  INCREMENT_VIEWS,
} from "src/apollo"

// export const wrapRootElement vs. exports.wrapRootElement...
export const wrapRootElement = ({ element }) => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>{element}</Provider>
    </ApolloProvider>
  )
}

/**
 * Fix Error:
 * `WebpackError: ReferenceError: IntersectionObserver is not defined`
 * https://github.com/gatsbyjs/gatsby/issues/10435#issuecomment-446627549
 */
export const onClientEntry = async () => {
  if (typeof IntersectionObserver === `undefined`) {
    await import(`intersection-observer`)
  }
}

// fires when arriving and leaving...
export const onRouteUpdate = async (
  { location, prevLocation, ...rest },
  plugins
) => {
  /**
   * shared vars for client mutations
   */
  const variables = { id: 1, location: location.href }

  try {
    await client
      .mutate({
        mutation: CREATE_PAGE,
        variables: variables,
      })
      .then(result => {})
  } catch (err) {
    console.log("I think this page was already created:", err)
  }

  client
    .mutate({
      mutation: INCREMENT_VIEWS,
      variables: variables,
    })
    .then(result => {
      console.log(
        "INCREMENT_VIEWS",
        location.href,
        result.data.incrementViews.views
      )
    })
}
