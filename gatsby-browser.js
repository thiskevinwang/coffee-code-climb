// custom typefaces
import "typeface-montserrat"
import "typeface-merriweather"

import * as React from "react"
import { Provider } from "react-redux"

import { store } from "./src/state"
import { client, CREATE_PAGE, GET_PAGE, INCREMENT_VIEWS } from "src/apollo"

// export const wrapRootElement vs. exports.wrapRootElement...
export const wrapRootElement = ({ element }) => {
  return <Provider store={store}>{element}</Provider>
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
export const onRouteUpdate = ({ location, prevLocation, ...rest }, plugins) => {
  // console.log({ location })
  try {
    client
      .mutate({
        mutation: CREATE_PAGE,
        variables: {
          id: 1,
          location: location.href,
        },
      })
      .then(result => {
        console.log("CREATE_PAGE", result)
      })
  } catch (err) {
    console.log("I think this page was already created:", err)
  }

  // client
  //   .query({
  //     query: GET_PAGE,
  //     variables: {
  //       id: 1,
  //       location: location.href,
  //     },
  //   })
  //   .then(result => {
  //     console.log("GET_PAGE", result)
  //   })
  client
    .mutate({
      mutation: INCREMENT_VIEWS,
      variables: {
        id: 1,
        location: location.href,
      },
    })
    .then(result => {
      console.log(
        "INCREMENT_VIEWS",
        location.href,
        result.data.incrementViews.views
      )
    })
}
