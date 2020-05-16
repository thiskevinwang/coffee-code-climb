/**
 * Logger middleware doesn't add any extra types to dispatch, just logs actions
 * and state.
 */
export const logger = (store) => (next) => (action) => {
  console.group(action.type)
  console.info("dispatching", action)
  let result = next(action)
  console.log("next state", store.getState())
  console.groupEnd()
  return result
}

/**
 * Schedules actions with { meta: { delay: N } } to be delayed by N milliseconds.
 * Makes `dispatch` return a function to cancel the timeout in this case.
 */
export const timeoutScheduler = (store) => (next) => (action) => {
  if (!action.meta || !action.meta.delay) {
    return next(action)
  }

  const timeoutId = setTimeout(() => next(action), action.meta.delay)

  return function cancel() {
    clearTimeout(timeoutId)
  }
}

/**
 * Lets you dispatch promises in addition to actions.
 * If the promise is resolved, its result will be dispatched as an action.
 * The promise is returned from `dispatch` so the caller may handle rejection.
 */
export const vanillaPromise = (store) => (next) => (action) => {
  if (typeof action.then !== "function") {
    return next(action)
  }

  return Promise.resolve(action).then(store.dispatch)
}

/**
 * Lets you dispatch special actions with a { promise } field.
 *
 * This middleware will turn them into a single action at the beginning,
 * and a single success (or failure) action when the `promise` resolves.
 *
 * For convenience, `dispatch` will return the promise so the caller can wait.
 */
export const readyStatePromise = (store) => (next) => (action) => {
  if (!action.promise) {
    return next(action)
  }

  function makeAction(ready, data) {
    const newAction = Object.assign({}, action, { ready }, data)
    delete newAction.promise
    return newAction
  }

  next(makeAction(false))
  return action.promise.then(
    (result) => next(makeAction(true, { result })),
    (error) => next(makeAction(true, { error }))
  )
}

/**
 * Lets you dispatch a function instead of an action.
 * This function will receive `dispatch` and `getState` as arguments.
 *
 * Useful for early exits (conditions over `getState()`), as well
 * as for async control flow (it can `dispatch()` something else).
 *
 * `dispatch` will return the return value of the dispatched function.
 */
export const thunk = (store) => (next) => (action) =>
  typeof action === "function"
    ? action(store.dispatch, store.getState)
    : next(action)
