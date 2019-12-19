import * as React from "react"
import { navigate } from "gatsby"
import moment from "moment"
import _ from "lodash"
import { graphql } from "gatsby"
import { useSpring, animated } from "react-spring"
import styled from "styled-components"
import { useMediaQuery } from "@material-ui/core"
import { useApolloClient } from "@apollo/react-hooks"

import { LayoutManager } from "components/layoutManager"
import { LoadingIndicator } from "components/LoadingIndicator"
import SEO from "components/seo"
import { Button } from "components/Button"
import { switchVariant } from "utils/rds"
import { useCommentLogic } from "hooks/rds/useCommentLogic"
import { useReactionLogic, ITEM_HEIGHT } from "hooks/rds/useReactionLogic"
import { Reaction } from "hooks/rds/useFetchReactionsAndSubscribeToMore"
import { useIO } from "hooks/useIO"
import { useAuthentication } from "hooks/useAuthentication"
import { useUploadAvatar } from "hooks/rds/useUploadAvatar"

const LEFT_OFFSET = 20

const Variant = styled(animated.div)`
  background: grey;
  display: flex;
  position: absolute;
  justify-content: center;
  border: 1px solid #808080;
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

const CommentRenderer = styled(animated.div)`
  display: flex;
  flex-direction: column;
  border: 1px solid lightgrey;
  border-radius: 0.2rem;
  margin-bottom: 1.25rem;
  padding: 1.5rem 1.5rem 0;

  > p {
    margin-bottom: 1rem; /* 16px */
  }
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
  > p {
    margin-bottom: 0px;
    will-change: color;
  }

  :hover {
    background: lightgrey;
    > p {
      color: black;
    }
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
    <FlexRow
      style={{
        borderTop: `1px solid lightgrey`,
      }}
    >
      <FlexBoxButton>
        <p>Like</p>
      </FlexBoxButton>
      <FlexBoxButton>
        <p>Comment</p>
      </FlexBoxButton>
      {!windowSm && (
        <FlexBoxButton>
          <p>Share</p>
        </FlexBoxButton>
      )}
    </FlexRow>
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

  const [file, setFile] = React.useState(null as File)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (files) {
      const file = files[0]
      setFile(file)
    } else {
      setFile(null)
    }
  }

  const { uploadAvatar } = useUploadAvatar({ onSuccess: () => setFile(null) })

  return (
    <LayoutManager location={props.location}>
      <SEO title="RDS" />
      <h1 {...bind}>Social Network Simulator</h1>
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

      <Button widthRem={10} onClick={handleLogout}>
        {currentUserId ? "Logout" : "Login"}
      </Button>
      <Container className={"comments"}>
        {isCommentQueryLoading && <LoadingIndicator />}
        {commentsTransition.map(({ item: _comment, props, key }) => (
          <CommentRenderer key={key} style={props}>
            <FlexRow style={{ marginBottom: `.5rem` }}>
              <Avatar src={_comment.user.avatar_url} />
              <FlexColumn>
                <small
                  style={{
                    // Make name green if it's the currently authenticated user
                    color: currentUserId == _comment.user.id && "green",
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
                {getListOfUniqueVariants(_comment.reactions as Reaction[]).map(
                  (variant, i) => (
                    <Variant
                      key={`${variant}-${i}`}
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
