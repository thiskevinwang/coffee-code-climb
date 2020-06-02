import React, { useState, useEffect, useRef } from "react"
// import ms from "ms"
import styled from "styled-components"
import theme from "styled-theming"
import { useTransition, config } from "react-spring"
import _ from "lodash"
import { useLazyQuery } from "@apollo/react-hooks"
import moment from "moment"

// Hooks
import { useIO } from "hooks/useIO"
import { useAuthentication } from "hooks/useAuthentication"
// import { useLazyPolling } from "hooks/apollo/useLazyPolling"

// Components
import { Avatar } from "components/Avatar"
import { LikeCommentShare } from "components/LikeCommentShare"
import { LoadingIndicator } from "components/LoadingIndicator"

// Other
import { Comment } from "entities"

// Relative
import { Overflow } from "../../Overflow"
import { GET_COMMENTS_BY_URL_QUERY, CommentOrderByInput } from "./query"
import {
  LEFT_OFFSET,
  CommentRenderer,
  FlexRow,
  FlexColumn,
  ReactionsContainer,
  Variant,
} from "../../../../pages/rds"

const Sentinel = styled.div`
  min-height: 5rem;
  border-color: ${theme("mode", {
    light: props => props.theme.commentRenderer.borderColor,
    dark: props => props.theme.commentRenderer.borderColor,
  })};
  border-width: 0.05rem;
  border-style: dashed;
  border-radius: 0.2rem;
`

interface IGetCommentsByUrlData {
  getCommentsByUrl: Comment[]
}
interface IGetCommentsByUrlVars {
  url: string
  filter: CommentOrderByInput
  skip: number
  take: number
}

/**
 * The value that is passed to graphql query's `take` parameter.
 *
 * The `update` fn in src/components/Comments/Create needs to match this initial
 * `getCommentsByUrl` query, EXACTLY, so that apollo can update local state
 * correctly.
 *
 * The pain point is that the `skip` and `take` parameters need to match exactly
 * as well. If updating local state is this tedious, websockets may be simpler
 * in the long run.
 * - Client updates the server & is simultaneously subscribed to the event that
 *   it itself is responsible for triggering.
 */
export const CHUNK = 3

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
  const [reachedEnd, setReachedEnd] = useState(false)
  const [
    getCommentsByUrl,
    {
      data,
      loading: queryLoading,
      // error: queryError,
      called,
      // startPolling,
      // stopPolling,
      fetchMore,
    },
  ] = useLazyQuery<IGetCommentsByUrlData, IGetCommentsByUrlVars>(
    GET_COMMENTS_BY_URL_QUERY
  )

  /**
   * When the window has focus, poll for new comments every 5 seconds...
   *
   * Each execution is around 500ms. Zeit provides 20 free hours per month,
   * which ends up as about 144,000 executions.
   *
   * Probably will not turn on polling for now.
   * @see https://zeit.co/docs/v2/platform/limits/
   */
  // useLazyPolling({
  //   startPolling,
  //   stopPolling,
  //   called,
  //   interval: ms("2s"),
  //   stopAfter: ms("3m"),
  // })

  const [isIntersecting, bind] = useIO({
    rootMargin: "0px 0px 0px 0px",
    threshold: 0.5,
  })

  const [comments, setComments] = useState<Comment[]>(
    data?.getCommentsByUrl ?? []
  )
  useEffect(() => {
    setComments([...(data?.getCommentsByUrl ?? [])])
  }, [data?.getCommentsByUrl])

  /** initial fetch */
  useEffect(() => {
    if (isIntersecting && comments.length === 0) {
      console.log("inital")
      getCommentsByUrl({
        variables: {
          url: url,
          filter: CommentOrderByInput.created_DESC,
          skip: comments.length,
          take: CHUNK,
        },
      })
    }
  }, [isIntersecting, comments.length])
  /**
   * subsequent fetches
   *  ⚠️ I'm not sure about why some of these values, which are
   * omitted from the dependencies array, cause the end behavior
   * to be what I'm looking for.
   */
  useEffect(() => {
    if (reachedEnd) return

    if (isIntersecting && called) {
      console.log("subsequent" + comments.length)
      fetchMore({
        variables: {
          url: url,
          filter: CommentOrderByInput.created_DESC,
          skip: comments.length,
          take: CHUNK,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          /** notify state that we've reached the end of the db table */
          if (fetchMoreResult.getCommentsByUrl.length === 0) {
            setReachedEnd(true)
          }

          return _.assign({}, prev, {
            getCommentsByUrl: [
              ...prev.getCommentsByUrl,
              ...fetchMoreResult.getCommentsByUrl,
            ],
          })
        },
      })
    }
  }, [isIntersecting, reachedEnd])

  /** @TODO serverless subscriptions */
  // const newCommentSubscription = useSubscription(NEW_COMMENT_SUBSCRIPTION)
  // const [comments, setComments] = useState<Comment[]>([])
  // useEffect(() => {
  //   if (!queryLoading && !queryError && called) {
  //     setComments(data.getCommentsByUrl)
  //   }
  //   return () => {}
  // }, [queryLoading, queryError, called])
  // useEffect(() => {
  //   if (!newCommentSubscription.loading && !newCommentSubscription.error) {
  //     const newComment: Comment = newCommentSubscription.data.newComment
  //     if (newComment && newComment.url === url) {
  //       setComments(s => [newComment, ...s])
  //     }
  //   }
  //   return () => {}
  // }, [newCommentSubscription.loading, newCommentSubscription.data?.newComment])

  const transition = useTransition(
    comments,
    e => `${e.id}-${new Date(e.created).getTime()}-${e.user.id}`,
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
      /** This doesn't really work as planned when fetching chunks of more than 1 entity. */
      // trail: 100,
      config: config.wobbly,
    }
  )

  /**
   * Our loading indicator that mocks the actual create-comment
   * UI element
   */
  if (queryLoading)
    return (
      <>
        <CommentRenderer>
          <FlexColumn style={{ textAlign: `center`, marginBottom: `.5rem` }}>
            <LoadingIndicator />
          </FlexColumn>
        </CommentRenderer>
        <Sentinel {...bind}></Sentinel>
      </>
    )
  /**
   * @TODO still need to display reactions
   */
  return (
    <>
      <div>
        {transition.map(({ item: _comment, props, key }) => {
          return (
            <CommentRenderer key={key} style={props}>
              <FlexRow style={{ marginBottom: `.5rem` }}>
                <Avatar src={_comment.user.avatar_url} />
                <FlexColumn style={{ flex: 1 }}>
                  <small
                    style={{
                      // Make name highlighted if it's the currently authenticated user
                      color:
                        parseInt(_comment.user.id) === currentUserId &&
                        "#3978ff",
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
                {parseInt(_comment.user.id) === currentUserId && (
                  <Overflow commentId={_comment.id} url={url} />
                )}
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
        })}
      </div>
      <Sentinel {...bind}>
        {comments.length < 1 && (
          <CommentRenderer {...bind}>
            <FlexRow style={{ marginBottom: `.5rem` }}>
              <p>Be the first to comment!</p>
            </FlexRow>
          </CommentRenderer>
        )}{" "}
      </Sentinel>
    </>
  )
}
