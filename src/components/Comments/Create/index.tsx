import React, { useState, useReducer, useEffect } from "react"
import { Link } from "gatsby"
import styled, { BaseProps } from "styled-components"
import theme from "styled-theming"
import { useSpring, animated } from "react-spring"
import { useApolloClient, useMutation, useLazyQuery } from "@apollo/react-hooks"
import _ from "lodash"

// Hooks
import { useAuthentication } from "hooks/useAuthentication"

// Components
import { SubmitButton } from "components/Form"
import { Avatar } from "components/Avatar"

// Consts/Utils
import * as Colors from "consts/Colors"

// Relative
import { CREATE_COMMENT_MUTATION } from "./mutation"
import { GET_USER_BY_ID_QUERY } from "./query"
import {
  GET_COMMENTS_BY_URL_QUERY,
  CommentOrderByInput,
} from "../Display/ByUrl/query"

const borderColor = theme("mode", {
  light: props => props.theme.commentRenderer.borderColor,
  dark: props => props.theme.commentRenderer.borderColor,
})

const Renderer = styled(animated.div)`
  display: flex;
  flex-direction: column;
  border-width: 1px;
  border-color: ${borderColor};
  border-style: solid;
  border-radius: 0.2rem;
  margin-bottom: 1.25rem;
  padding: 0.5rem 1.5rem 0;
`

export const DivTitle = styled(animated.div)`
  border-bottom-color: ${borderColor};
  border-bottom-width: 1px;
  border-bottom-style: solid;
  margin-bottom: 1rem;

  font-weight: 500;
  color: ${theme("mode", {
    light: Colors.greyLighter,
    dark: Colors.greyDarker,
  })};
  transition: color 150ms ease-in-out;
  will-change: color;

  :hover {
    color: ${theme("mode", {
      light: Colors.greyDarker,
      dark: Colors.greyLighter,
    })} !important;
  }
`

const Textarea = styled(animated.textarea)`
  --geist-cyan: #79ffe1;
  --geist-purple: #f81ce5;

  caret-color: ${theme("mode", {
    light: "var(--geist-cyan)",
    dark: "var(--geist-purple)",
  })} !important;

  caret-color: ${theme("mode", {
    light: Colors.greyDarker,
    dark: Colors.greyLighter,
  })};
  color: ${theme("mode", {
    light: Colors.greyDarker,
    dark: Colors.greyLighter,
  })};
  font-weight: 300;
  background: transparent;
  border: none;
  margin-bottom: 1rem; /* 16px */
  resize: none;

  ::placeholder {
    color: ${borderColor};
  }
  :focus {
    outline: none;
  }
`

type CommentState = {
  body: string
}

const commentReducer = (state: CommentState, action: any): CommentState => {
  return { ...state, ...action }
}

export const CreateComment = ({ url }) => {
  const { currentUserId } = useAuthentication()

  const [state, dispatch] = useReducer(commentReducer, { body: "" })
  const [
    getUserById,
    { data, called: queryCalled, loading: queryLoading, query: queryError },
  ] = useLazyQuery(GET_USER_BY_ID_QUERY)

  /** Only send this query if currentUserId exists */
  useEffect(() => {
    if (currentUserId) getUserById({ variables: { id: currentUserId } })
  }, [currentUserId])

  const [createComment, { loading: mutationLoading, error }] = useMutation(
    CREATE_COMMENT_MUTATION,
    {
      variables: {
        body: state.body,
        url,
      },
      onCompleted: () => {
        dispatch({ body: "" })
      },
      /**
       * Update the local state to match mutated DB state
       * - this is a workaround/alternative to subscriptions
       */
      update: (cache, { data: { createComment } }) => {
        const { getCommentsByUrl } = cache.readQuery({
          query: GET_COMMENTS_BY_URL_QUERY,
          variables: { url, filter: CommentOrderByInput.created_DESC },
        })

        cache.writeQuery({
          query: GET_COMMENTS_BY_URL_QUERY,
          variables: { url, filter: CommentOrderByInput.created_DESC },
          data: { getCommentsByUrl: [createComment, ...getCommentsByUrl] },
        })
      },
    }
  )
  const assignFormProps = (fieldName: string) => {
    switch (fieldName) {
      case "submit":
        return {
          type: "submit",
          onClick: (e: React.SyntheticEvent<HTMLButtonElement>) => {
            e.preventDefault()
            createComment()
          },
          disabled: state.body.length < 1 || mutationLoading,
        }
      default:
        return {
          id: fieldName /* need this for <label for=""> */,
          name: fieldName,
          type: fieldName,
          placeholder: fieldName,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              [fieldName]: _.trimStart(e.target.value),
            })
          },
        }
    }
  }
  const [hasFocus, setHasFocus] = useState(false)
  const textareaProps = useSpring({
    height: hasFocus ? 150 : 50,
    width: `100%`,
  })
  const [submitButtonProps] = useSpring(() => ({}))

  const client = useApolloClient()
  const { first_name: firstName, avatar_url: avatarUrl } =
    client.cache.data.data[`User:${currentUserId}`] ?? {}

  /**
   * Our loading indicator that mocks the actual create-comment
   * UI element
   */
  if (queryLoading)
    return (
      <Renderer>
        <DivTitle>&nbsp;</DivTitle>
        <SubmitButton style={{ width: `100%` }} disabled>
          &nbsp;
        </SubmitButton>
      </Renderer>
    )

  return (
    <Renderer>
      <DivTitle>Create Post</DivTitle>
      {currentUserId ? (
        <>
          <div style={{ display: `flex` }}>
            <Avatar src={avatarUrl}></Avatar>
            <Textarea
              value={state.body}
              {...assignFormProps("body")}
              style={textareaProps}
              onFocus={() => {
                setHasFocus(true)
              }}
              onBlur={() => {
                setHasFocus(!!state.body ?? false)
              }}
              placeholder={`What's on your mind, ${firstName}?`}
            />
          </div>
          <SubmitButton
            {...assignFormProps("submit")}
            style={{ ...submitButtonProps, width: `100%` }}
          >
            Post
          </SubmitButton>
        </>
      ) : (
        <p>
          You must&nbsp;<Link to={"/auth/login"}>{"log in"}</Link>&nbsp;to
          comment.
        </p>
      )}
    </Renderer>
  )
}
