import React, { useState, useEffect } from "react"
import _ from "lodash"
import { graphql } from "gatsby"
import { useTransition, useSpring, animated } from "react-spring"
import styled from "styled-components"
import { LayoutManager } from "src/components/layoutManager"
import SEO from "../components/seo"
import { LoadingIndicator, switchVariant } from "./rds/utils"
import { useFetchReactionsAndSubscribeToMore } from "hooks/useFetchReactionsAndSubscribeToMore"

const ITEM_HEIGHT = 63

const Container = styled(animated.div)`
  position: relative;
`
const Item = styled(animated.div)`
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
  const [
    queryProps,
    subscriptionProps,
    client,
  ] = useFetchReactionsAndSubscribeToMore()

  const [reactions, setReactions] = useState([])
  useEffect(() => {
    if (!queryProps.loading)
      setReactions(
        queryProps.data.getAllReactions.sort(e => e.comment.id) ?? []
      )
    return () => {}
  }, [queryProps])

  const containerProps = useSpring({
    height: reactions.length === 0 ? 0 : ITEM_HEIGHT * reactions.length,
  })
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

  return (
    <LayoutManager location={props.location}>
      <SEO title="RDS" />
      <h1>Reaction System</h1>

      <Container style={containerProps}>
        {queryProps.loading && <LoadingIndicator />}
        {transition.map(({ item, props, key }) => {
          return (
            <Item key={key} style={props}>
              {switchVariant(item?.variant)}
            </Item>
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
