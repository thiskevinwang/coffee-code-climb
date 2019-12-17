import { useEffect, useReducer } from "react"
import { useTransition } from "react-spring"
import _ from "lodash"
import { useFetchComments, Comment } from "hooks/rds/useFetchComments"

type Action =
  | {
      type: "getAllComments"
      getAllComments: Comment[]
    }
  | {
      type: "newComment"
      newComment: Comment
    }

function commentsReducer(state: Comment[], action: Action): Comment[] {
  switch (action.type) {
    case "getAllComments":
      return action.getAllComments
    case "newComment":
      return [...state, action.newComment]
    default:
      return state
  }
}

export function useCommentLogic() {
  const {
    lazyQueryProps: [fetchComments, { called, loading, error, data }],
    subscriptionProps,
    client,
  } = useFetchComments()
  useEffect(fetchComments, [])

  const [comments, dispatch] = useReducer(commentsReducer, [])
  useEffect(() => {
    if (!loading && !error && called) {
      dispatch({
        type: "getAllComments",
        getAllComments: data.getAllComments ?? [],
      })
    }
    return () => {}
  }, [loading, error, called])
  useEffect(() => {
    if (!subscriptionProps.loading && !subscriptionProps.error) {
      const newComment: Comment = subscriptionProps.data.newComment
      if (newComment) {
        dispatch({
          type: "newComment",
          newComment: newComment,
        })
      }
    }
    return () => {}
  }, [subscriptionProps.loading, subscriptionProps.data?.newComment])

  const transition = useTransition(
    comments,
    e => `${e.id}-${e.created}-${e.updated}`,
    {
      from: item => ({
        opacity: 0,
        transform: `scale(0)`,
      }),
      enter: item => ({
        opacity: 1,
        transform: `scale(1)`,
      }),
      update: item => ({
        opacity: 1,
      }),
      leave: {
        opacity: 0,
        transform: `scale(0)`,
        borderColor: `red`,
      },
      trail: 50,
    }
  )

  return { transition, comments, isQueryLoading: loading }
}
