import { useEffect, useReducer } from "react"
import { useTransition, config } from "react-spring"
import _ from "lodash"

import { useFetchComments } from "hooks/rds/useFetchComments"
import { Reaction, Comment } from "entities"

type Action =
  | {
      type: "getAllComments"
      getAllComments: Comment[]
    }
  | {
      type: "newComment"
      newComment: Comment
    }
  | {
      type: "newReaction"
      newReaction: Reaction
    }

const sortByNewest = _.flow(_.partialRight(_.sortBy, "created"), _.reverse)

function commentsReducer(state: Comment[], action: Action): Comment[] {
  switch (action.type) {
    case "getAllComments":
      return sortByNewest(action.getAllComments)
    case "newComment":
      return sortByNewest([...state, action.newComment])
    case "newReaction":
      /**
       * In the case of a newReaction subscription, we have to
       * find the comment, in state, and create Left/Right slices
       * of state,
       * - [...left, comment, ...right]
       *
       * Take the comment's reactions, which is another array,
       * and update that accordingly
       *
       * An incoming newReaction could match an existing reaction
       * by id.
       * - In that case, we update the `variant`, and return the array
       *
       * An incoming newReaction could also be brand new, and its
       * id will not exist in the array.
       * - In that case, we return a new array via `concat()`
       *
       */
      const updatedCommentId = action.newReaction.comment.id
      /* index of previous comment to replace with `newReactions` */
      const i = _.findIndex(state, { id: updatedCommentId })
      /* "left" and "right" of the previous comment array element */
      const left = state.slice(0, i)
      const right = state.slice(i + 1)
      /* clone the comment whose reactions we want to update */
      const comment = _.cloneDeep(state[i])

      const match = _.findIndex(comment.reactions, {
        id: action.newReaction.id,
      })

      let updatedReactions: Reaction[]
      if (match < 0) {
        updatedReactions = comment.reactions.concat(action.newReaction)
      } else {
        updatedReactions = _.map([...comment.reactions], (reaction, i) => {
          if (reaction.id === action.newReaction.id) {
            return action.newReaction
          } else {
            return reaction
          }
        })
      }

      const output = { ...comment, reactions: updatedReactions } as Comment
      return sortByNewest([...left, output, ...right])
    default:
      return state
  }
}

/**
 * @TODO sort out `isIntersecting` logic.
 * I want to fire an api call if "some element"
 * is intersecting with the viewport
 * - Like for a blog post, only load comments when
 *   the reader scrolls to the bottom.
 */
export function useCommentLogic({ isIntersecting } = { isIntersecting: true }) {
  const {
    getAllCommentsLazyQuery: [fetchComments, { called, loading, error, data }],
    newCommentSubscription,
    newReactionSubscription,
  } = useFetchComments()
  useEffect(() => {
    isIntersecting && fetchComments()
  }, [isIntersecting])

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
    if (!newCommentSubscription.loading && !newCommentSubscription.error) {
      const newComment: Comment = newCommentSubscription.data.newComment
      if (newComment) {
        dispatch({
          type: "newComment",
          newComment: newComment,
        })
      }
    }
    return () => {}
  }, [newCommentSubscription.loading, newCommentSubscription.data?.newComment])

  useEffect(() => {
    if (!newReactionSubscription.loading && !newReactionSubscription.error) {
      const newReaction = newReactionSubscription.data.newReaction
      if (newReaction) {
        dispatch({
          type: "newReaction",
          newReaction: newReaction,
        })
      }
    }
    return () => {}
  }, [
    newReactionSubscription.loading,
    newReactionSubscription.data?.newReaction,
  ])

  const transition = useTransition(
    comments,
    e => `${e.id}-${e.created}-${e.updated}`,
    {
      from: item => ({
        opacity: 0,
        transform: `scale(0.8)`,
        filter: `blur(10px)`,
        willChange: `opacity, transform, filter`,
      }),
      enter: item => ({
        opacity: 1,
        transform: `scale(1)`,
        filter: `blur(0px)`,
      }),
      update: item => ({
        opacity: 1,
      }),
      leave: {
        opacity: 0,
        transform: `scale(0.8)`,
        filter: `blur(10px)`,
      },
      trail: 50,
      config: config.slow,
    }
  )

  return { transition, comments, isQueryLoading: loading }
}
