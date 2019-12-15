import React, { useState, useEffect } from "react"
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

const RdsPage = props => {
  const {
    lazyQueryProps: [fetchAllReactions, queryProps],
    subscriptionProps,
    client,
  } = useFetchReactionsAndSubscribeToMore()
  useEffect(fetchAllReactions, [])

  const [reactions, setReactions] = useState([] as Reaction[])
  useEffect(() => {
    if (!queryProps.loading && !queryProps.error && queryProps.called) {
      setReactions(queryProps.data.getAllReactions ?? [])
    }
    return () => {}
  }, [queryProps.loading, queryProps.called])
  useEffect(() => {
    if (!subscriptionProps.loading && !subscriptionProps.error) {
      const newReaction: Reaction = subscriptionProps.data.newReaction
      if (newReaction) {
        setReactions(s => {
          /* index of oldReaction to replace with `newReaction` */
          const i = _.findIndex(s, { id: newReaction.id })
          /* "left" and "right" of the oldReaction array element */
          const left = s.slice(0, i)
          const right = s.slice(i + 1)
          return [...left, newReaction, ...right]
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
  const containerProps = useSpring({
    height: reactions.length === 0 ? 0 : ITEM_HEIGHT * reactions.length,
  })

  return (
    <LayoutManager location={props.location}>
      <SEO title="RDS" />
      <h1>Reaction System</h1>

      <Container style={containerProps}>
        {queryProps.loading && <LoadingIndicator />}
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
