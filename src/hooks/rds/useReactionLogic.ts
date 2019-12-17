import { useReducer, useEffect } from "react"
import { useTransition } from "react-spring"
import _ from "lodash"
import {
  useFetchReactionsAndSubscribeToMore,
  Reaction,
} from "hooks/rds/useFetchReactionsAndSubscribeToMore"

export const ITEM_HEIGHT = 30
/**
 * thank god for
 * https://artsy.github.io/blog/2018/11/21/conditional-types-in-typescript/
 */
type Action =
  | {
      type: "getAllReactions"
      getAllReactions: Reaction[]
    }
  | {
      type: "newReaction"
      newReaction: Reaction
    }

function reactionsReducer(state: Reaction[], action: Action): Reaction[] {
  switch (action.type) {
    case "getAllReactions":
      return action.getAllReactions
    case "newReaction":
      /* index of oldReaction to replace with `newReaction` */
      const i = _.findIndex(state, { id: action.newReaction.id })
      /* "left" and "right" of the oldReaction array element */
      const left = state.slice(0, i)
      const right = state.slice(i + 1)
      return [...left, action.newReaction, ...right]
    default:
      return state
  }
}

export function useReactionLogic() {
  const {
    lazyQueryProps: [fetchAllReactions, queryProps],
    subscriptionProps,
  } = useFetchReactionsAndSubscribeToMore()
  useEffect(fetchAllReactions, [])

  const [reactions, dispatch] = useReducer(reactionsReducer, [])
  useEffect(() => {
    if (!queryProps.loading && !queryProps.error && queryProps.called) {
      dispatch({
        type: "getAllReactions",
        getAllReactions: queryProps.data.getAllReactions ?? [],
      })
    }
    return () => {}
  }, [queryProps.loading, queryProps.called])
  useEffect(() => {
    if (!subscriptionProps.loading && !subscriptionProps.error) {
      const newReaction: Reaction = subscriptionProps.data.newReaction
      if (newReaction) {
        dispatch({
          type: "newReaction",
          newReaction: newReaction,
        })
      }
    }
    return () => {}
  }, [subscriptionProps.loading, subscriptionProps.data?.newReaction])

  const transition = useTransition(
    reactions,
    e => `${e.id}-${e.created}-${e.updated}-${e.variant}`,
    {
      from: item => ({
        opacity: 0,
        transform: `rotate(-360deg)`,
        borderColor: `white`,
        // top: ITEM_HEIGHT * (reactions.indexOf(item) ?? 0),
      }),
      enter: item => ({
        opacity: 1,
        transform: `rotate(0deg)`,
        borderColor: `white`,
        // top: ITEM_HEIGHT * (reactions.indexOf(item) ?? 0),
      }),
      update: item => ({
        opacity: 1,
        borderColor: `green`,
        // top: ITEM_HEIGHT * (reactions.indexOf(item) ?? 0),
      }),
      leave: {
        opacity: 0,
        transform: `rotate(360deg)`,
        borderColor: `red`,
      },
      trail: 50,
    }
  )

  return { transition, reactions, isQueryLoading: queryProps.loading }
}
