import * as React from "react"
import _ from "lodash"
import { graphql } from "gatsby"
import { useSpring, animated } from "react-spring"
import styled from "styled-components"
import { LayoutManager } from "components/layoutManager"
import { LoadingIndicator } from "components/LoadingIndicator"
import SEO from "../components/seo"
import { switchVariant } from "../utils/rds"
import { useCommentLogic } from "hooks/rds/useCommentLogic"
import { useReactionLogic, ITEM_HEIGHT } from "hooks/rds/useReactionLogic"
import { Reaction } from "hooks/rds/useFetchReactionsAndSubscribeToMore"

const LEFT_OFFSET = 20

const Variant = styled(animated.div)`
  background: grey;
  display: flex;
  position: absolute;
  justify-content: center;
  border: 1px dashed white;
  border-radius: 100%;
  text-align: center;
  height: ${ITEM_HEIGHT}px;
  width: ${ITEM_HEIGHT}px;
  padding-left: 4px;
  top: 0px;
`

const FlexColumn = styled(animated.div)`
  display: flex;
  flex-direction: column;
`
const Container = styled(animated.div)`
  position: relative;
`

const ReactionRenderer = styled(animated.div)``
const ReactionsContainer = styled(animated.div)`
  width: 100%;
  left: 0;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const CommentRenderer = styled(animated.div)`
  display: flex;
  flex-direction: column;
  border: 1px dashed white;
  border-radius: 10px;
  margin: 5px;
  padding: 25px;

  > p {
    border-bottom: 1px dashed grey;
  }
`

const RdsPage = props => {
  const {
    transition: reactionsTransition,
    reactions,
    isQueryLoading: isReactionQueryLoading,
  } = useReactionLogic()
  const {
    transition: commentsTransition,
    comments,
    isQueryLoading: isCommentQueryLoading,
  } = useCommentLogic()

  const reactionContainerProps = useSpring({
    height: ITEM_HEIGHT,
  })

  return (
    <LayoutManager location={props.location}>
      <SEO title="RDS" />
      <h1>Reaction System</h1>

      <Container className={"comments"}>
        {isCommentQueryLoading && <LoadingIndicator />}
        {commentsTransition.map(({ item: _comment, props, key }) => (
          <CommentRenderer key={key} style={props}>
            <p>{_comment.body}</p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <small>
                Author: <b>{_comment.user.username}</b>
              </small>
              <FlexColumn>
                <small>Posted: {timeDifferenceForDate(_comment.created)}</small>
                {_comment.updated && (
                  <small>
                    Edited: {timeDifferenceForDate(_comment.updated)}
                  </small>
                )}
              </FlexColumn>
            </div>

            <Container className={"reactions"} style={reactionContainerProps}>
              <ReactionsContainer>
                {getListOfUniqueVariants(_comment.reactions as Reaction[]).map(
                  (variant, i) => (
                    <Variant
                      style={{
                        left: `${LEFT_OFFSET * i}px`,
                        zIndex: `${10 - i}`,
                      }}
                    >
                      {switchVariant(variant)}
                    </Variant>
                  )
                )}
                <div
                  style={{
                    top: 0,
                    position: "absolute",
                    left: `${(getListOfUniqueVariants(
                      _comment.reactions as Reaction[]
                    ).length +
                      1) *
                      LEFT_OFFSET}px`,
                  }}
                >
                  <small>
                    {isReactionQueryLoading ? (
                      <LoadingIndicator />
                    ) : (
                      _.intersectionWith(
                        _.map(reactions, e => e.id),
                        _.map(_comment.reactions, e => e.id),
                        _.isEqual
                      ).length
                    )}
                  </small>
                </div>
              </ReactionsContainer>
            </Container>
          </CommentRenderer>
        ))}
      </Container>
    </LayoutManager>
  )
}

export default RdsPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`

// TODO: move these out

function getListOfUniqueVariants(reactions: Reaction[]) {
  return reactions ? _.uniq(reactions.map(e => e.variant)) : []
}

function timeDifference(current, previous) {
  const milliSecondsPerMinute = 60 * 1000
  const milliSecondsPerHour = milliSecondsPerMinute * 60
  const milliSecondsPerDay = milliSecondsPerHour * 24
  const milliSecondsPerMonth = milliSecondsPerDay * 30
  const milliSecondsPerYear = milliSecondsPerDay * 365

  const elapsed = current - previous

  if (elapsed < milliSecondsPerMinute / 3) {
    return "just now"
  }

  if (elapsed < milliSecondsPerMinute) {
    return "less than 1 min ago"
  } else if (elapsed < milliSecondsPerHour) {
    return Math.round(elapsed / milliSecondsPerMinute) + " min ago"
  } else if (elapsed < milliSecondsPerDay) {
    return Math.round(elapsed / milliSecondsPerHour) + " h ago"
  } else if (elapsed < milliSecondsPerMonth) {
    return Math.round(elapsed / milliSecondsPerDay) + " days ago"
  } else if (elapsed < milliSecondsPerYear) {
    return Math.round(elapsed / milliSecondsPerMonth) + " mo ago"
  } else {
    return Math.round(elapsed / milliSecondsPerYear) + " years ago"
  }
}

export function timeDifferenceForDate(date) {
  const now = new Date().getTime()
  const updated = new Date(date).getTime()
  return timeDifference(now, updated)
}
