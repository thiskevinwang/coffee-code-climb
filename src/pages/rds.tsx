import React, { useReducer, useEffect } from "react"
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

const ITEM_HEIGHT = 63

const Container = styled(animated.div)`
  position: relative;
`
const ReactionRenderer = styled(animated.div)`
  display: flex;
  justify-content: center;
  border: 1px dashed white;
  border-radius: 100%;
  height: ${ITEM_HEIGHT}px;
  width: ${ITEM_HEIGHT}px;
  position: absolute;
  font-size: 36px;
`

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

function reducer(state: Reaction[], action: Action): Reaction[] {
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
function useReactionLogic() {
  const {
    lazyQueryProps: [fetchAllReactions, queryProps],
    subscriptionProps,
    client,
  } = useFetchReactionsAndSubscribeToMore()
  useEffect(fetchAllReactions, [])

  const [reactions, dispatch] = useReducer(reducer, [])
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
        transform: `translateX(-200%) rotate(-360deg)`,
        borderColor: `white`,
        top: ITEM_HEIGHT * (reactions.indexOf(item) ?? 0),
      }),
      enter: item => ({
        opacity: 1,
        transform: `translateX(0%) rotate(0deg)`,
        borderColor: `white`,
        top: ITEM_HEIGHT * (reactions.indexOf(item) ?? 0),
      }),
      update: item => ({
        opacity: 1,
        borderColor: `green`,
        top: ITEM_HEIGHT * (reactions.indexOf(item) ?? 0),
      }),
      leave: {
        opacity: 0,
        transform: `translateX(200%) rotate(360deg)`,
        borderColor: `red`,
      },
      trail: 50,
    }
  )

  return { transition, reactions, isQueryLoading: queryProps.loading }
}

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
