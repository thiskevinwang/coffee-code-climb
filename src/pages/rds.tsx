// Dependencies
import * as React from "react"
import { navigate } from "gatsby"
import _ from "lodash"
import { graphql } from "gatsby"
import { animated } from "react-spring"
import styled, { BaseProps } from "styled-components"
import theme from "styled-theming"
import { useApolloClient } from "@apollo/client"

// Hooks
import { ITEM_HEIGHT } from "hooks/rds/useReactionLogic"
import { useAuthentication } from "hooks/useAuthentication"

// Components
import SEO from "components/seo"
import { LayoutManager } from "components/layoutManager"
import { CreateComment } from "components/Comments/Create"
import { SubmitButton } from "components/Form"
import { CommentsByUrl } from "components/Comments/Display/ByUrl"

export const LEFT_OFFSET = 20

const backgroundPosition = theme.variants("mode", "variant", {
  default: { light: "0% 0%", dark: "0% 0%" },
  Like: { light: "0% 0%", dark: "33.3333% 0%" }, //                    :smile: | :upside_down:
  Love: { light: "41.6667% 0%", dark: "83.3333% 0%" }, //              :heart_eyes: | :star_struck:
  Haha: { light: "16.6667% 0%", dark: "19.4444% 0%" }, //              :joy: | :rofl:
  Wow: { light: "100% 2.85714%", dark: "36.1111% 2.85714%" }, //       :open_mouth: | :exploding_head:
  Sad: { light: "19.4444% 2.85714%", dark: "22.2222% 2.85714%" }, //   :cry: | :sob:
  Angry: { light: "27.7778% 2.85714%", dark: "30.5556% 2.85714%" }, // :angry: | :rage:
  None: { light: "0% 0%", dark: "0% 0%" }, // :_: | :_:
})

export const Variant = styled(animated.div)`
  transition: background-position 150ms ease-in-out;
  will-change: background;
  background-image: url(https://pf-emoji-service--cdn.us-east-1.prod.public.atl-paas.net/standard/a51a7674-8d5d-4495-a2d2-a67c090f5c3b/32x32/spritesheets/people.png);
  background-position: ${backgroundPosition};
  background-size: 3700% 3600%;
  height: ${ITEM_HEIGHT}px;
  width: ${ITEM_HEIGHT}px;
`
// Variant.defaultProps = {
//   position: "relative",
// }

export const FlexColumn = styled(animated.div)`
  display: flex;
  flex-direction: column;
`
export const FlexRow = styled(animated.div)`
  display: flex;
  flex-direction: row;
`
const Container = styled(animated.div)`
  position: relative;
`

export const ReactionsContainer = styled(animated.div)`
  width: 100%;
  left: 0;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const borderColor = theme("mode", {
  light: (props: BaseProps) => props.theme.commentRenderer.borderColor,
  dark: (props: BaseProps) => props.theme.commentRenderer.borderColor,
})
export const CommentRenderer = styled(animated.div)`
  display: flex;
  flex-direction: column;
  /* border: 1px solid lightgrey; */
  border-width: 1px;
  border-color: ${borderColor};
  border-style: solid;
  border-radius: 0.2rem;
  margin-bottom: 1.25rem;
  padding: 1.5rem 1.5rem 0;

  > p {
    margin-bottom: 1rem; /* 16px */
  }
`

const RdsPage = ({ location }: { location: Location }) => {
  const { currentUserId } = useAuthentication()
  const client = useApolloClient()
  /**
   * @TODO
   * - return this func from `useAuthentication`
   * - expose an optional `callback` argument, so you can pass
   *   a `navigate()`, or other behavior to it, after
   *   clearing a token
   *
   */
  const handleLogout = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    localStorage.removeItem("token")
    client.resetStore()
    navigate("/auth/login/", {
      replace: true,
    })
  }

  return (
    <LayoutManager location={location}>
      <SEO title="RDS" />
      <h1>RDS</h1>

      <SubmitButton onClick={handleLogout}>
        {currentUserId ? "Logout" : "Login"}
      </SubmitButton>
      <Container className={"comments"}>
        <CreateComment url={location.pathname} />
        <CommentsByUrl url={location.pathname} />
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
