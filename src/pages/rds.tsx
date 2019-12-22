import * as React from "react"
import { navigate } from "gatsby"
import moment from "moment"
import _ from "lodash"
import { graphql } from "gatsby"
import { useSpring, animated } from "react-spring"
import styled, { BaseProps } from "styled-components"
import theme from "styled-theming"
import { useMediaQuery } from "@material-ui/core"
import { useApolloClient } from "@apollo/react-hooks"
import { Tooltip } from "@material-ui/core"

import { LayoutManager } from "components/layoutManager"
import { LoadingIndicator } from "components/LoadingIndicator"
import SEO from "components/seo"
import { SubmitButton } from "components/Form"
// import { switchVariant } from "utils/rds"
import { useCommentLogic } from "hooks/rds/useCommentLogic"
import { useReactionLogic, ITEM_HEIGHT } from "hooks/rds/useReactionLogic"
import { Reaction } from "hooks/rds/useFetchReactionsAndSubscribeToMore"
import { useIO } from "hooks/useIO"
import { useAuthentication } from "hooks/useAuthentication"
import { useUploadAvatar } from "hooks/rds/useUploadAvatar"

const LEFT_OFFSET = 20

type VariantNames = Reaction["variant"]
const backgroundPosition = theme.variants("mode", "variant", {
  default: { light: "0% 0%", dark: "0% 0%" },
  Like: { light: "0% 0%", dark: "33.3333% 0%" }, //                    :smile: | :upside_down:
  Love: { light: "41.6667% 0%", dark: "83.3333% 0%" }, //              :heart_eyes: | :star_struck:
  Haha: { light: "16.6667% 0%", dark: "19.4444% 0%" }, //              :joy: | :rofl:
  Wow: { light: "100% 2.85714%", dark: "0% 0%" }, //                   :open_mouth: | :exploding_head:
  Sad: { light: "19.4444% 2.85714%", dark: "22.2222% 2.85714%" }, //   :cry: | :sob:
  Angry: { light: "27.7778% 2.85714%", dark: "30.5556% 2.85714%" }, // :angry: | :rage:
  None: { light: "0% 0%", dark: "0% 0%" }, // :_: | :_:
})

const Variant = styled(animated.div)`
  /* transition: background 150ms ease-in-out; */
  will-change: background;
  background-image: url(https://pf-emoji-service--cdn.us-east-1.prod.public.atl-paas.net/standard/a51a7674-8d5d-4495-a2d2-a67c090f5c3b/32x32/spritesheets/people.png);
  background-position: ${backgroundPosition};
  background-size: 3700% 3600%;
  height: ${ITEM_HEIGHT}px;
  width: ${ITEM_HEIGHT}px;

  position: absolute;
  top: 0px;
`
// Variant.defaultProps = {
//   variant: "default",
// }

const FlexColumn = styled(animated.div)`
  display: flex;
  flex-direction: column;
`
const FlexRow = styled(animated.div)`
  display: flex;
  flex-direction: row;
`
const Container = styled(animated.div)`
  position: relative;
`

const Avatar = styled(animated.div)`
  min-width: 40px;
  min-height: 40px;
  width: 40px;
  height: 40px;
  border-radius: 100%;
  background: rebeccapurple /* fallback when there's no props.src url */;
  background-image: url(${props => props.src});
  background-position: center;
  background-size: 100%;
  margin-right: 10px;
`

const ReactionsContainer = styled(animated.div)`
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
const CommentRenderer = styled(animated.div)`
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
const Line = styled(animated.div)`
  height: 1px;
  background: ${borderColor};
`

const FlexBoxButton = styled.div`
  align-items: center;
  border-radius: 0.2rem;
  cursor: pointer;
  display: flex;
  flex: 1;
  height: 3rem;
  justify-content: center;
  margin: 5px;

  transition: background 200ms ease-in-out;
  will-change: background;

  color: ${theme("mode", {
    light: (props: BaseProps) => props.theme.formInput.color,
    dark: (props: BaseProps) => props.theme.formInput.color,
  })};

  :hover {
    background: ${theme("mode", {
      light: (props: BaseProps) => props.theme.commentRenderer.borderColor,
      dark: (props: BaseProps) => props.theme.commentRenderer.borderColor,
    })};
  }
`

/**
 * @TODO
 * https://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way/
 */
const ChooseFile = styled(animated.input)`
  /* Hide the actual input */
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;

  + label {
    border: 1px solid lightgray;
    border-radius: 0.25rem;
    padding: 0.75rem 0.5rem;
  }
  :focus + label,
  + label:hover {
    cursor: pointer;
  }
`
const UploadButton = styled(animated.button)`
  border: 1px solid lightgray;
  border-radius: 0.25rem;
`

const LikeOrComment = () => {
  const windowSm = useMediaQuery("(max-width:480px)")
  return (
    <>
      <Line />
      <FlexRow>
        <FlexBoxButton>Like</FlexBoxButton>
        <FlexBoxButton>Comment</FlexBoxButton>
        {!windowSm && <FlexBoxButton>Share</FlexBoxButton>}
      </FlexRow>
    </>
  )
}
const RdsPage = props => {
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
    navigate("/auth/login", {
      replace: true,
    })
  }

  const [isIntersecting, bind] = useIO({
    rootMargin: "0px 0px 0px 0px",
    threshold: 0.25,
  })
  const {
    transition: reactionsTransition,
    reactions,
    isQueryLoading: isReactionQueryLoading,
  } = useReactionLogic()
  const {
    transition: commentsTransition,
    comments,
    isQueryLoading: isCommentQueryLoading,
  } = useCommentLogic({ isIntersecting })

  const reactionContainerProps = useSpring({
    height: ITEM_HEIGHT,
  })

  // const [file, setFile] = React.useState(null as File)
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files

  //   if (files) {
  //     const file = files[0]
  //     setFile(file)
  //   } else {
  //     setFile(null)
  //   }
  // }

  // const { uploadAvatar } = useUploadAvatar({ onSuccess: () => setFile(null) })

  return (
    <LayoutManager location={props.location}>
      <SEO title="RDS" />
      <h1 {...bind}>Social Network Simulator</h1>
      {/* 
      <ChooseFile
        name="file"
        id="file"
        type="file"
        accept={"image/png, image/jpeg"}
        onChange={handleChange}
      />
      <label for="file">Select an img</label>

      {file && (
        <UploadButton
          onClick={() => uploadAvatar(file)}
        >{`Upload ${file.name}`}</UploadButton>
      )}
      */}

      <SubmitButton onClick={handleLogout}>
        {currentUserId ? "Logout" : "Login"}
      </SubmitButton>
      <Container className={"comments"}>
        {isCommentQueryLoading && <LoadingIndicator />}
        {commentsTransition.map(({ item: _comment, props, key }) => (
          <CommentRenderer key={key} style={props}>
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <FlexColumn>
                {_comment.updated && (
                  <small>
                    Edited: {timeDifferenceForDate(_comment.updated)}
                  </small>
                )}
              </FlexColumn>
            </div>

            <Container
              className={"reactions"}
              style={{ ...reactionContainerProps, marginBottom: `1rem` }}
            >
              <ReactionsContainer>
                {_.uniqBy(_comment.reactions, "variant").map((e, i) => (
                  <Variant
                    variant={e.variant}
                    key={`${e.variant}-${i}`}
                    style={{
                      left: `${LEFT_OFFSET * i}px`,
                      zIndex: `${10 - i}`,
                    }}
                  >
                    {/* ... */}
                  </Variant>
                ))}
                <div
                  style={{
                    top: 0,
                    position: "absolute",
                    /**
                     * offset the reactionCount by # of unique
                     * reaction variants, + 1
                     */
                    left: `${(_.uniqBy(_comment.reactions, "variant").length +
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
            <LikeOrComment />
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
