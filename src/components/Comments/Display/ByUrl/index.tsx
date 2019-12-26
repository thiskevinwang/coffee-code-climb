import React, { useState, useReducer, useRef } from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import theme from "styled-theming"
import { useSpring, animated } from "react-spring"
import _ from "lodash"
import { useLazyQuery, useApolloClient } from "@apollo/react-hooks"
import moment from "moment"

// Hooks
import { useIO } from "hooks/useIO"
import { useAuthentication } from "hooks/useAuthentication"

// Components
import { SubmitButton } from "components/Form"
import { Avatar } from "components/Avatar"
import { LikeCommentShare } from "components/LikeCommentShare"

// Other
import * as Colors from "consts/Colors"
import { Reaction, Comment } from "entities"

// Relative
import { GET_COMMENTS_BY_URL_QUERY, CommentOrderByInput } from "./query"
import {
  LEFT_OFFSET,
  CommentRenderer,
  FlexRow,
  FlexColumn,
  ReactionsContainer,
  Variant,
} from "../../../../pages/rds"

/**
 * This component takes `url` prop, and fetches all comments by this
 * url.
 *
 * @usage
 * ```tsx
 * import { CommentsByUrl } from "components/Comments/Display/ByUrl"
 *
 * <CommentsByUrl url={location.pathname} />
 * ```
 */
export const CommentsByUrl = ({ url }) => {
  const { currentUserId } = useAuthentication()

  const [
    getCommentsByUrl,
    { data, loading: queryLoading, query: queryError },
  ] = useLazyQuery<{
    getCommentsByUrl: Comment[]
  }>(GET_COMMENTS_BY_URL_QUERY, {
    variables: { url: url, filter: CommentOrderByInput.created_DESC },
  })

  const didIntersect = useRef(false)
  const [isIntersecting, bind] = useIO({
    rootMargin: "0px 0px 0px 0px",
    threshold: 0.25,
  })
  if (isIntersecting) {
    if (didIntersect.current === false) {
      getCommentsByUrl()
      didIntersect.current = true
    }
  }

  /**
   * Our loading indicator that mocks the actual create-comment
   * UI element
   */
  if (queryLoading)
    return (
      <CommentRenderer {...bind}>
        <FlexRow style={{ marginBottom: `.5rem` }}>
          <p>Loading</p>
        </FlexRow>
      </CommentRenderer>
    )
  if (data?.getCommentsByUrl.length < 1)
    return (
      <CommentRenderer {...bind}>
        <FlexRow style={{ marginBottom: `.5rem` }}>
          <p>Be the first to comment!</p>
        </FlexRow>
      </CommentRenderer>
    )
  /**
   * @TODO still need to display reactions
   */
  return (
    data?.getCommentsByUrl.map((_comment, i) => {
      return (
        <CommentRenderer key={_comment.id} {...bind}>
          <FlexRow style={{ marginBottom: `.5rem` }}>
            <Avatar src={_comment.user.avatar_url} />
            <FlexColumn>
              <small
                style={{
                  // Make name highlighted if it's the currently authenticated user
                  color: currentUserId == _comment.user.id && "#3978ff",
                }}
              >
                <b>
                  {_comment.user.first_name} {_comment.user.last_name}
                </b>
              </small>
              <small>
                {moment(_comment.created).format("MMMM DD \\at h:mm A")}
              </small>
            </FlexColumn>
          </FlexRow>

          <p>{_comment.body}</p>
          <ReactionsContainer style={{ height: 30, marginBottom: `1rem` }}>
            {_.flow(
              _.partialRight(_.uniqBy, "variant"),
              _.partialRight(_.filter, e => e.variant !== "None")
            )(_comment.reactions).map((e, i) => {
              return (
                <Variant
                  variant={e.variant}
                  key={`${e.variant}-${i}`}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: `${LEFT_OFFSET * i}px`,
                    zIndex: `${10 - i}`,
                  }}
                >
                  {/* ... */}
                </Variant>
              )
            })}
            <div
              style={{
                top: 0,
                position: "absolute",
                /**
                 * offset the reactionCount by # of unique
                 * reaction variants, + 1
                 */
                left: `${(_.flow(
                  _.partialRight(_.uniqBy, "variant"),
                  _.partialRight(_.filter, e => e.variant !== "None"),
                  _.size
                )(_comment.reactions) +
                  1) *
                  LEFT_OFFSET}px`,
              }}
            >
              <small>
                {_.flow(
                  _.partialRight(_.filter, e => e.variant !== "None"),
                  _.size
                )(_comment.reactions)}
              </small>
            </div>
          </ReactionsContainer>
          <LikeCommentShare commentId={_comment.id} />
        </CommentRenderer>
      )
    }) ?? <p {...bind}>👀👀👀</p>
  )
}
