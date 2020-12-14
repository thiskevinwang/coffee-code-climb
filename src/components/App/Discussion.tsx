import React, { useState } from "react"
import ms from "ms"
import styled from "styled-components"
import { Editor, EditorState, convertFromRaw, convertToRaw } from "draft-js"
import { navigate, RouteComponentProps } from "@reach/router"
import { useSnackbar } from "notistack"
import { useQuery, useMutation, gql } from "@apollo/client"
import { Form, Formik } from "formik"
import Box from "@material-ui/core/Box"
import Avatar from "@material-ui/core/Avatar"

import { Divider, fs } from "components/Fieldset"
import { RichEditor } from "components/RichEditor"
import { SubmitButton } from "components/Form/SubmitButton"
import { TextField } from "./Shared/TextField"
import { Mutation, MutationCreateCommentArgs, Query } from "types"
import { useVerifyTokenSet } from "utils"

/**
 * @param input Input should be a millisecond value
 * @returns a `ms`-lib string
 */
const getTimeAgo = (input: Date | number): string => {
  if (!input) return ""
  /** @example 1607888427495 */
  const nowMs = +new Date()
  const inputMs = +new Date(input)
  return ms(nowMs - inputMs)
}

const StylesContainer = styled.div`
  .timeline-item {
    position: relative;

    :first-child::before {
      content: "";
      position: absolute;
      width: 2px;
      height: calc(100% - calc(var(--geist-gap) + 13px));
      top: calc(var(--geist-gap) + 13px);
      left: calc(var(--geist-gap) + 13px);

      background: var(--accents-2);
    }
    :not(:first-child)::before {
      content: "";
      position: absolute;
      width: 2px;
      height: 100%;
      top: 0;
      left: calc(var(--geist-gap) + 13px);

      background: var(--accents-2);
    }
  }
`

const GET_DISCUSSION_BY_ID_QUERY = gql`
  query GetDiscussionById($id: ID!) {
    getDiscussionById(id: $id) {
      id
      created
      title
      content
      authorId
      comments {
        id
        created
        content
        authorId
        replies {
          id
          created
          content
          authorId
        }
      }
    }
  }
`

const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      created
      content
    }
  }
`

interface CreateCommentResponse {
  createComment: Mutation["createComment"]
}

interface GetDiscussionByIdResponse {
  getDiscussionById: Query["getDiscussionById"]
}

/**
 * rendered @ /app/discussions/:discussionId
 */
export const Discussion = ({
  discussionId,
}: RouteComponentProps<{ discussionId: string }>) => {
  const { accessTokenPayload } = useVerifyTokenSet()
  const userId = accessTokenPayload?.username

  const [replyPrompts, setReplyPrompts] = useState<{
    [commentId: string]: boolean
  }>({})
  const { enqueueSnackbar } = useSnackbar()

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  )

  const [createComment] = useMutation<
    CreateCommentResponse,
    MutationCreateCommentArgs
  >(CREATE_COMMENT_MUTATION)

  const { data, error } = useQuery<GetDiscussionByIdResponse>(
    GET_DISCUSSION_BY_ID_QUERY,
    {
      variables: { id: discussionId },
      onCompleted: (data) => {
        const editorState = EditorState.createWithContent(
          convertFromRaw(JSON.parse(data?.getDiscussionById?.content ?? ""))
        )
        setEditorState(editorState)
      },
    }
  )

  if (error) return <p>Error...</p>
  if (!data?.getDiscussionById) return <p>Loading</p>

  return (
    <StylesContainer>
      <SubmitButton onClick={() => navigate(-1)}>
        ← Back to discussions
      </SubmitButton>
      <br />
      <br />
      <h1 style={{ fontWeight: "bold" }}>{data?.getDiscussionById?.title}</h1>
      <small>By {data?.getDiscussionById?.authorId},</small>&nbsp;
      <br />
      <br />
      <fs.Fieldset>
        <fs.Content>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            marginBottom={1}
          >
            <Avatar
              style={{
                height: 28,
                width: 28,
                marginRight: "var(--geist-gap-half)",
              }}
            />
            <span>
              <b>{data?.getDiscussionById?.authorId}</b>
            </span>
            &nbsp;
            <small>
              {getTimeAgo(data?.getDiscussionById?.created)}&nbsp;ago
            </small>
          </Box>
          <Editor editorState={editorState} onChange={() => {}} readOnly />
        </fs.Content>
        <fs.Footer></fs.Footer>
      </fs.Fieldset>
      {data?.getDiscussionById?.comments?.map((comment) => {
        const editorState = EditorState.createWithContent(
          convertFromRaw(JSON.parse(comment?.content ?? ""))
        )
        return (
          <fs.Fieldset /* [n] comments */
            style={{ marginLeft: "var(--geist-gap-double)" }}
            key={comment?.id}
          >
            <Box /* CONTENT */>
              <Box /* ROOT COMMENT */
                padding={"var(--geist-gap) var(--geist-gap) 0"}
              >
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Avatar
                    style={{
                      height: 28,
                      width: 28,
                      marginRight: "var(--geist-gap-half)",
                    }}
                  />
                  <span>
                    <b>{comment?.authorId}</b>&nbsp;
                  </span>
                  <small>
                    {ms(+new Date() - +new Date(comment?.created))} ago
                  </small>
                </Box>
              </Box>
              <Box /* ROOT COMMENT 2 */
                marginTop={1}
                padding={"0 var(--geist-gap) var(--geist-gap)"}
                borderBottom="1px solid var(--accents-2)"
                style={{
                  borderBottomLeftRadius: "5px",
                  borderBottomRightRadius: "5px",
                }}
              >
                <Editor
                  editorState={editorState}
                  onChange={() => {}}
                  readOnly
                />
              </Box>
              <Box /* REPLIES, IF ANY */
                style={{ background: "var(--accents-1)" }}
              >
                {comment?.replies?.map((reply) => {
                  const editorState = EditorState.createWithContent(
                    convertFromRaw(JSON.parse(reply?.content ?? ""))
                  )
                  return (
                    <Box
                      className="timeline-item"
                      key={reply?.id}
                      padding="var(--geist-gap)"
                    >
                      <Box display="flex" flexDirection="row">
                        <Avatar
                          style={{
                            height: 28,
                            width: 28,
                            marginRight: "var(--geist-gap-half)",
                          }}
                        />
                        <Box>
                          <span>
                            <b>{reply?.authorId}</b>
                          </span>
                          &nbsp;
                          <small>{getTimeAgo(reply?.created)}&nbsp;ago</small>
                          <Editor
                            editorState={editorState}
                            onChange={() => {}}
                            readOnly
                          />
                        </Box>
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            </Box>
            <fs.Footer /* Reply to a comment */>
              <Box /* Click to reply to a comment */
                display={!replyPrompts[comment?.id!] ? "flex" : "none"}
                flexDirection="row"
                alignItems="center"
                flex={1}
              >
                <Avatar
                  style={{
                    height: 28,
                    width: 28,
                    marginRight: "var(--geist-gap-half)",
                  }}
                />
                <TextField
                  fullWidth
                  placeholder="Write a reply"
                  onClick={() => {
                    setReplyPrompts((s) => ({ ...s, [comment?.id!]: true }))
                  }}
                />
              </Box>
              <Box /* Prompt for replying to a comment */
                display={replyPrompts[comment?.id!] ? "block" : "none"}
                flex={1}
              >
                <Formik
                  initialValues={{
                    editorState: EditorState.createEmpty(),
                  }}
                  onSubmit={async ({ editorState }, { setFieldValue }) => {
                    const contentString = JSON.stringify(
                      convertToRaw(editorState.getCurrentContent())
                    )

                    try {
                      createComment({
                        variables: {
                          input: {
                            authorId: userId,
                            discussionId: discussionId!,
                            content: contentString,
                            replyToId: comment?.id,
                          },
                        },
                        update: (cache, { data: { createComment } }) => {
                          const previous = cache.readQuery<{
                            getDiscussionById: Query["getDiscussionById"]
                          }>({
                            query: GET_DISCUSSION_BY_ID_QUERY,
                            variables: { id: discussionId },
                          })

                          const previousComments =
                            previous?.getDiscussionById?.comments ?? []

                          cache.writeQuery({
                            query: GET_DISCUSSION_BY_ID_QUERY,
                            variables: {
                              id: discussionId,
                            },
                            data: {
                              getDiscussionById: {
                                ...previous?.getDiscussionById,
                                comments: [...previousComments, createComment],
                              },
                            },
                          })
                        },
                      })

                      enqueueSnackbar("Reply created!", {
                        variant: "success",
                      })
                      setFieldValue("editorState", EditorState.createEmpty())
                    } catch (err) {}
                  }}
                >
                  {(props) => {
                    const { editorState } = props.values
                    const { setFieldValue } = props
                    return (
                      <Form>
                        <RichEditor
                          editorState={editorState}
                          onChange={(state) =>
                            setFieldValue("editorState", state)
                          }
                        />
                        <Box mr={1} display="inline-block">
                          <SubmitButton
                            type="button"
                            secondary
                            onClick={() => {
                              setReplyPrompts((s) => ({
                                ...s,
                                [comment?.id!]: false,
                              }))
                            }}
                          >
                            Cancel
                          </SubmitButton>
                        </Box>
                        <SubmitButton>Reply</SubmitButton>
                      </Form>
                    )
                  }}
                </Formik>
              </Box>
            </fs.Footer>
          </fs.Fieldset>
        )
      })}
      <Box mb={"var(--geist-gap)"}>
        <Divider />
      </Box>
      <Formik /* Write a comment */
        initialValues={{
          editorState: EditorState.createEmpty(),
        }}
        onSubmit={async ({ editorState }, { setFieldValue }) => {
          const contentString = JSON.stringify(
            convertToRaw(editorState.getCurrentContent())
          )

          createComment({
            variables: {
              input: {
                authorId: userId,
                discussionId: discussionId!,
                content: contentString,
              },
            },
            update: (cache, { data: { createComment } }) => {
              const previous = cache.readQuery<{
                getDiscussionById: Query["getDiscussionById"]
              }>({
                query: GET_DISCUSSION_BY_ID_QUERY,
                variables: { id: discussionId },
              })

              const previousComments =
                previous?.getDiscussionById?.comments ?? []

              cache.writeQuery({
                query: GET_DISCUSSION_BY_ID_QUERY,
                variables: {
                  id: discussionId,
                },
                data: {
                  getDiscussionById: {
                    ...previous?.getDiscussionById,
                    comments: [...previousComments, createComment],
                  },
                },
              })
            },
          })

          enqueueSnackbar("Post created!", { variant: "success" })
          setFieldValue("editorState", EditorState.createEmpty())
        }}
      >
        {(props) => {
          const { editorState } = props.values
          const { setFieldValue } = props
          return (
            <Form>
              <RichEditor
                editorState={editorState}
                onChange={(state) => setFieldValue("editorState", state)}
              />

              <SubmitButton>Reply</SubmitButton>
            </Form>
          )
        }}
      </Formik>
    </StylesContainer>
  )
}
