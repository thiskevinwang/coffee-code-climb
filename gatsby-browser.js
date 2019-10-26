import * as React from "react"
// import ReactDOM from "react-dom"
import { Provider, useSelector, useDispatch } from "react-redux"
import { Transition } from "react-transition-group"
import { useSpring, animated } from "react-spring"

import { store } from "./src/_reduxState"
import {
  ApolloProvider,
  client,
  CREATE_PAGE,
  GET_PAGE,
  INCREMENT_VIEWS,
} from "src/apollo"

const duration = 600
const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
}

const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
}

const RootTransitionWrapper = props => {
  const [inProp, setInProp] = React.useState(false)

  /**
   * @TODO Spring animate this
   */
  // const [{ opacity }, set] = useSpring(() => ({
  //   opacity: inProp ? 1 : 0,
  // }))

  React.useEffect(() => {
    setInProp(true)
    return () => {}
  }, [])

  return (
    <Transition timeout={duration} in={inProp} appear={true}>
      {state => {
        return (
          <animated.div
            // style={{ opacity }}
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}
          >
            {props.children}
          </animated.div>
        )
      }}
    </Transition>
  )
}

// export const wrapRootElement vs. exports.wrapRootElement...
export const wrapRootElement = ({ element }) => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <RootTransitionWrapper>{element}</RootTransitionWrapper>
      </Provider>
    </ApolloProvider>
  )
}

/**
 * @TODO see if redux updates on pageElement mount/unmount is the way to go
 */
// const ReduxTransitionStateUpdater = props => {
//   const dispatch = useDispatch()

//   React.useEffect(() => {
//     dispatch(setTransitionState(true))
//     return () => dispatch(setTransitionState(false))
//   })

//   return props.children
// }
// export const wrapPageElement = ({ element, props }) => {
//   return <ReduxTransitionStateUpdater>{element}</ReduxTransitionStateUpdater>
// }

/**
 * Fix Error:
 * `WebpackError: ReferenceError: IntersectionObserver is not defined`
 * https://github.com/gatsbyjs/gatsby/issues/10435#issuecomment-446627549
 */
export const onClientEntry = async (_, plugins) => {
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

  await client
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

/**
 * CONCURRENT MODE!!!
 *
 * https://reactjs.org/docs/concurrent-mode-adoption.html
 */
// export const replaceHydrateFunction = () => {
//   return (element, container, callback) => {
//     /**
//      * Old
//      */
//     // ReactDOM.render(element, container, callback);

//     /**
//      * New
//      */
//     ReactDOM.unstable_createRoot(container).render(element)
//   }
// }
