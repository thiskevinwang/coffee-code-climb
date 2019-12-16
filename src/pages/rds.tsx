import * as React from "react"
import _ from "lodash"
import { graphql } from "gatsby"
import { useTransition, useSpring, animated } from "react-spring"
import styled from "styled-components"
import { LayoutManager } from "components/layoutManager"
import { LoadingIndicator } from "components/LoadingIndicator"
import SEO from "../components/seo"
import { switchVariant } from "../utils/rds"
import {
  useFetchReactionsAndSubscribeToMore,
  Reaction,
} from "hooks/useFetchReactionsAndSubscribeToMore"

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
  const { transition, reactions, isQueryLoading } = useReactionLogic()

  const containerProps = useSpring({
    height: reactions.length === 0 ? 0 : ITEM_HEIGHT * reactions.length,
  })

  return (
    <LayoutManager location={props.location}>
      <SEO title="RDS" />
      <h1>Reaction System</h1>

      <Container style={containerProps}>
        {isQueryLoading && <LoadingIndicator />}
        {transition.map(({ item, props, key }) => {
          return (
            <ReactionRenderer key={key} style={props}>
              {switchVariant(item?.variant)}
            </ReactionRenderer>
          )
        })}
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
